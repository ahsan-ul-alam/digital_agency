<?php

namespace App\Services;

use App\Models\PaymentTransaction;
use App\Support\PaymentHelpers;
use App\Support\PaymentSettings;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class BkashPaymentService
{
    public function isReady(): bool
    {
        $settings = PaymentSettings::get();

        return ! empty($settings['bkash_enabled'])
            && filled($settings['bkash_username'])
            && filled($settings['bkash_password'])
            && filled($settings['bkash_app_key'])
            && filled($settings['bkash_app_secret']);
    }

    public function createCheckout(PaymentTransaction $transaction, string $payerReference, string $callbackUrl): array
    {
        $token = $this->grantToken();
        $settings = PaymentSettings::get();

        $response = Http::timeout(30)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'authorization' => $token,
                'x-app-key' => $settings['bkash_app_key'],
            ])
            ->post($this->baseUrl().'tokenized/checkout/create', [
                'mode' => '0011',
                'payerReference' => $payerReference,
                'callbackURL' => $callbackUrl,
                'amount' => PaymentHelpers::formatBkashAmount($transaction->amount),
                'currency' => 'BDT',
                'intent' => 'sale',
                'merchantInvoiceNumber' => $transaction->merchant_transaction_id,
            ]);

        $payload = $response->json();

        if (! $response->successful() || empty($payload['paymentID']) || empty($payload['bkashURL'])) {
            throw new RuntimeException($this->extractError($payload, 'Unable to start bKash payment.'));
        }

        return $payload;
    }

    public function execute(string $paymentId): array
    {
        $token = $this->grantToken();
        $settings = PaymentSettings::get();

        $response = Http::timeout(30)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'authorization' => $token,
                'x-app-key' => $settings['bkash_app_key'],
            ])
            ->post($this->baseUrl().'tokenized/checkout/execute', [
                'paymentID' => $paymentId,
            ]);

        return $response->json() ?? [];
    }

    public function query(string $paymentId): array
    {
        $token = $this->grantToken();
        $settings = PaymentSettings::get();

        $response = Http::timeout(30)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'authorization' => $token,
                'x-app-key' => $settings['bkash_app_key'],
            ])
            ->post($this->baseUrl().'tokenized/checkout/payment/status', [
                'paymentID' => $paymentId,
            ]);

        return $response->json() ?? [];
    }

    private function grantToken(): string
    {
        $settings = PaymentSettings::get();
        $cacheKey = 'bkash.token.'.($settings['bkash_sandbox'] ? 'sandbox' : 'live');

        return Cache::remember($cacheKey, now()->addMinutes(50), function () use ($settings) {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'username' => $settings['bkash_username'],
                    'password' => $settings['bkash_password'],
                ])
                ->post($this->baseUrl().'tokenized/checkout/token/grant', [
                    'app_key' => $settings['bkash_app_key'],
                    'app_secret' => $settings['bkash_app_secret'],
                ]);

            $payload = $response->json();

            if (! $response->successful() || empty($payload['id_token'])) {
                Cache::forget($cacheKey);
                throw new RuntimeException($this->extractError($payload, 'Unable to authenticate with bKash.'));
            }

            return $payload['id_token'];
        });
    }

    private function extractError(?array $payload, string $fallback): string
    {
        if (! is_array($payload)) {
            return $fallback;
        }

        return $payload['statusMessage']
            ?? $payload['errorMessage']
            ?? $payload['message']
            ?? $fallback;
    }

    private function baseUrl(): string
    {
        $settings = PaymentSettings::get();

        return ! empty($settings['bkash_sandbox'])
            ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/'
            : 'https://tokenized.pay.bka.sh/v1.2.0-beta/';
    }
}
