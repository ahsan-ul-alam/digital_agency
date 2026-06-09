<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\PaymentTransaction;
use App\Models\User;
use App\Support\GatewayHash;
use App\Support\PaymentSettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use RuntimeException;

class EpsPaymentService
{
    public function isReady(): bool
    {
        $settings = PaymentSettings::get();

        return ! empty($settings['eps_enabled'])
            && filled($settings['eps_merchant_id'])
            && filled($settings['eps_store_id'])
            && filled($settings['eps_username'])
            && filled($settings['eps_password'])
            && filled($settings['eps_hash_key']);
    }

    public function initialize(Invoice $invoice, PaymentTransaction $transaction, User $user, array $urls): array
    {
        $settings = PaymentSettings::get();
        $merchantTransactionId = $transaction->merchant_transaction_id;

        $body = [
            'merchantId' => $settings['eps_merchant_id'],
            'storeId' => $settings['eps_store_id'],
            'CustomerOrderId' => $invoice->invoice_number,
            'merchantTransactionId' => $merchantTransactionId,
            'transactionTypeId' => 1,
            'totalAmount' => (float) $transaction->amount,
            'successUrl' => $urls['success'],
            'failUrl' => $urls['fail'],
            'cancelUrl' => $urls['cancel'],
            'customerName' => $user->name,
            'customerEmail' => $user->email,
            'customerAddress' => 'Dhaka',
            'customerCity' => 'Dhaka',
            'customerState' => 'Dhaka',
            'customerPostcode' => '1200',
            'customerCountry' => 'Bangladesh',
            'customerPhone' => $this->normalizePhone($user->lead?->phone),
            'productName' => 'Invoice '.$invoice->invoice_number,
            'productProfile' => 'general',
            'productCategory' => 'services',
            'noOfItem' => '1',
            'ProductList' => [
                [
                    'ProductName' => 'Invoice '.$invoice->invoice_number,
                    'NoOfItem' => '1',
                    'ProductProfile' => 'general',
                    'ProductCategory' => 'services',
                    'ProductPrice' => (string) $transaction->amount,
                ],
            ],
        ];

        $response = $this->postInitialize($settings, $merchantTransactionId, $body, $this->getToken());

        if ($this->shouldRefreshToken($response)) {
            $this->forgetToken();
            $response = $this->postInitialize($settings, $merchantTransactionId, $body, $this->getToken());
        }

        return $this->parseInitializeResponse($response);
    }

    public function verify(string $merchantTransactionId): array
    {
        $settings = PaymentSettings::get();
        $token = $this->getToken();

        $response = Http::timeout(30)
            ->withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer '.$token,
                'x-hash' => GatewayHash::eps($merchantTransactionId, $settings['eps_hash_key']),
            ])
            ->get($this->verifyUrl(), [
                'merchantTransactionId' => $merchantTransactionId,
            ]);

        return $response->json() ?? [];
    }

    public function isSuccessful(array $payload): bool
    {
        $status = strtolower((string) ($payload['Status'] ?? $payload['status'] ?? ''));

        return in_array($status, ['success', 'completed'], true);
    }

    public function decryptIpn(string $encrypted): ?array
    {
        $settings = PaymentSettings::get();
        $secret = $settings['eps_hash_key'] ?? '';

        if (! str_contains($encrypted, ':') || $secret === '') {
            return null;
        }

        [$ivEncoded, $cipherEncoded] = explode(':', $encrypted, 2);
        $iv = base64_decode($ivEncoded, true);
        $cipher = base64_decode($cipherEncoded, true);

        if ($iv === false || $cipher === false) {
            return null;
        }

        $key = str_pad(substr($secret, 0, 32), 32, "\0");
        $decrypted = openssl_decrypt($cipher, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        if ($decrypted === false) {
            return null;
        }

        $data = json_decode($decrypted, true);

        return is_array($data) ? $data : null;
    }

    private function getToken(): string
    {
        $settings = PaymentSettings::get();
        $cacheKey = $this->tokenCacheKey($settings);

        $cached = Cache::get($cacheKey);
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        return $this->requestToken($settings, $cacheKey);
    }

    private function requestToken(array $settings, string $cacheKey): string
    {
        $response = Http::timeout(30)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'x-hash' => GatewayHash::eps($settings['eps_username'], $settings['eps_hash_key']),
            ])
            ->post($this->tokenUrl(), [
                'userName' => $settings['eps_username'],
                'password' => $settings['eps_password'],
            ]);

        $payload = $response->json();

        if (! $response->successful() || empty($payload['token'])) {
            Cache::forget($cacheKey);
            throw new RuntimeException($this->extractError($payload, $response, 'Unable to authenticate with EPS.'));
        }

        $expiresAt = $this->tokenExpiresAt($payload['expireDate'] ?? null);
        Cache::put($cacheKey, $payload['token'], $expiresAt);

        return $payload['token'];
    }

    private function postInitialize(array $settings, string $merchantTransactionId, array $body, string $token): Response
    {
        return Http::timeout(30)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Authorization' => 'Bearer '.$token,
                'x-hash' => GatewayHash::eps($merchantTransactionId, $settings['eps_hash_key']),
            ])
            ->post($this->initUrl(), $body);
    }

    private function parseInitializeResponse(Response $response): array
    {
        $payload = $response->json();
        $redirectUrl = $payload['RedirectURL'] ?? $payload['RedirectUrl'] ?? null;

        if (! $response->successful() || empty($redirectUrl)) {
            throw new RuntimeException($this->extractError($payload, $response, 'Unable to start EPS payment.'));
        }

        $payload['RedirectURL'] = $redirectUrl;

        return $payload;
    }

    private function shouldRefreshToken(Response $response): bool
    {
        if (in_array($response->status(), [401, 403, 404], true)) {
            return true;
        }

        $payload = $response->json();

        return is_array($payload) && empty($payload['RedirectURL'] ?? $payload['RedirectUrl'] ?? null);
    }

    private function tokenExpiresAt(?string $expireDate): Carbon
    {
        if ($expireDate) {
            try {
                $expiresAt = Carbon::parse($expireDate)->subSeconds(15);

                if ($expiresAt->isFuture()) {
                    return $expiresAt;
                }
            } catch (\Throwable) {
                // Fall through to short-lived default cache.
            }
        }

        return now()->addMinutes(2);
    }

    private function tokenCacheKey(array $settings): string
    {
        return 'eps.token.'.(! empty($settings['eps_sandbox']) ? 'sandbox' : 'live');
    }

    private function forgetToken(): void
    {
        $settings = PaymentSettings::get();
        Cache::forget($this->tokenCacheKey($settings));
    }

    private function normalizePhone(?string $phone): string
    {
        $digits = preg_replace('/\D/', '', (string) $phone);

        if (str_starts_with($digits, '880') && strlen($digits) === 13) {
            $digits = '0'.substr($digits, 3);
        }

        return preg_match('/^01\d{9}$/', $digits) ? $digits : '01700000000';
    }

    private function extractError(?array $payload, Response $response, string $fallback): string
    {
        if (is_array($payload)) {
            foreach (['ErrorMessage', 'errorMessage', 'message', 'error'] as $key) {
                $message = trim((string) ($payload[$key] ?? ''));

                if ($message !== '') {
                    return $message;
                }
            }
        }

        if (! $response->successful()) {
            return $fallback.' (HTTP '.$response->status().').';
        }

        return $fallback;
    }

    private function tokenUrl(): string
    {
        $settings = PaymentSettings::get();

        return ! empty($settings['eps_sandbox'])
            ? 'https://sandboxpgapi.eps.com.bd/v1/Auth/GetToken'
            : 'https://pgapi.eps.com.bd/v1/Auth/GetToken';
    }

    private function initUrl(): string
    {
        $settings = PaymentSettings::get();

        return ! empty($settings['eps_sandbox'])
            ? 'https://sandboxpgapi.eps.com.bd/v1/EPSEngine/InitializeEPS'
            : 'https://pgapi.eps.com.bd/v1/EPSEngine/InitializeEPS';
    }

    private function verifyUrl(): string
    {
        $settings = PaymentSettings::get();

        return ! empty($settings['eps_sandbox'])
            ? 'https://sandboxpgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus'
            : 'https://pgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus';
    }
}
