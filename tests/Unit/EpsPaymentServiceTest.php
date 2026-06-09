<?php

namespace Tests\Unit;

use App\Models\Invoice;
use App\Models\PaymentTransaction;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\EpsPaymentService;
use App\Support\PaymentSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class EpsPaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        SiteSetting::create([
            'key' => 'payments',
            'value' => PaymentSettings::sandboxDefaults(),
        ]);

        Cache::flush();
    }

    public function test_is_ready_when_eps_credentials_are_configured(): void
    {
        $service = app(EpsPaymentService::class);

        $this->assertTrue($service->isReady());
    }

    public function test_it_caches_token_until_expire_date(): void
    {
        Http::fake([
            'sandboxpgapi.eps.com.bd/v1/Auth/GetToken' => Http::response([
                'token' => 'eps-test-token',
                'expireDate' => now()->addHour()->toIso8601String(),
            ]),
        ]);

        $service = app(EpsPaymentService::class);
        $reflection = new \ReflectionClass($service);
        $method = $reflection->getMethod('getToken');
        $method->setAccessible(true);

        $this->assertSame('eps-test-token', $method->invoke($service));
        $this->assertSame('eps-test-token', $method->invoke($service));

        Http::assertSentCount(1);
    }

    public function test_it_refreshes_token_and_retries_initialize_on_unauthorized(): void
    {
        Http::fake([
            'sandboxpgapi.eps.com.bd/v1/Auth/GetToken' => Http::sequence()
                ->push(['token' => 'stale-token', 'expireDate' => now()->addHour()->toIso8601String()])
                ->push(['token' => 'fresh-token', 'expireDate' => now()->addHour()->toIso8601String()]),
            'sandboxpgapi.eps.com.bd/v1/EPSEngine/InitializeEPS' => Http::sequence()
                ->push(['message' => 'Unauthorized'], 401)
                ->push([
                    'TransactionId' => 'txn-123',
                    'RedirectURL' => 'https://sandbox.eps.com.bd/pay/txn-123',
                ]),
        ]);

        [$invoice, $transaction, $user] = $this->makePaymentContext();

        $result = app(EpsPaymentService::class)->initialize($invoice, $transaction, $user, [
            'success' => 'https://example.test/success',
            'fail' => 'https://example.test/fail',
            'cancel' => 'https://example.test/cancel',
        ]);

        $this->assertSame('https://sandbox.eps.com.bd/pay/txn-123', $result['RedirectURL']);
        Http::assertSentCount(4);
    }

    public function test_initialize_returns_redirect_url_on_success(): void
    {
        Http::fake([
            'sandboxpgapi.eps.com.bd/v1/Auth/GetToken' => Http::response([
                'token' => 'eps-test-token',
                'expireDate' => now()->addHour()->toIso8601String(),
            ]),
            'sandboxpgapi.eps.com.bd/v1/EPSEngine/InitializeEPS' => Http::response([
                'TransactionId' => 'txn-456',
                'RedirectURL' => 'https://sandbox.eps.com.bd/pay/txn-456',
            ]),
        ]);

        [$invoice, $transaction, $user] = $this->makePaymentContext();

        $result = app(EpsPaymentService::class)->initialize($invoice, $transaction, $user, [
            'success' => 'https://example.test/success',
            'fail' => 'https://example.test/fail',
            'cancel' => 'https://example.test/cancel',
        ]);

        $this->assertSame('https://sandbox.eps.com.bd/pay/txn-456', $result['RedirectURL']);
        $this->assertSame('txn-456', $result['TransactionId']);
    }

    public function test_verify_marks_successful_statuses(): void
    {
        Http::fake([
            'sandboxpgapi.eps.com.bd/v1/Auth/GetToken' => Http::response([
                'token' => 'eps-test-token',
                'expireDate' => now()->addHour()->toIso8601String(),
            ]),
            'sandboxpgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus*' => Http::response([
                'Status' => 'Success',
            ]),
        ]);

        $service = app(EpsPaymentService::class);
        $payload = $service->verify('INV-1-eps-abc123');

        $this->assertTrue($service->isSuccessful($payload));
    }

    public function test_decrypt_ipn_returns_payload(): void
    {
        $secret = PaymentSettings::sandboxDefaults()['eps_hash_key'];
        $payload = ['merchant_transaction_id' => 'INV-1-eps-abc123', 'status' => 'success'];
        $encrypted = $this->encryptIpn($payload, $secret);

        $decrypted = app(EpsPaymentService::class)->decryptIpn($encrypted);

        $this->assertSame($payload, $decrypted);
    }

    public function test_token_expires_before_api_expire_date(): void
    {
        Http::fake([
            'sandboxpgapi.eps.com.bd/v1/Auth/GetToken' => Http::response([
                'token' => 'eps-test-token',
                'expireDate' => '2026-06-09T12:00:00+06:00',
            ]),
        ]);

        Carbon::setTestNow('2026-06-09T11:00:00+06:00');

        $service = app(EpsPaymentService::class);
        $reflection = new \ReflectionClass($service);
        $expiresAt = $reflection->getMethod('tokenExpiresAt');
        $expiresAt->setAccessible(true);

        $result = $expiresAt->invoke($service, '2026-06-09T12:00:00+06:00');

        $this->assertTrue($result->equalTo(Carbon::parse('2026-06-09T11:59:45+06:00')));
    }

    /**
     * @return array{0: Invoice, 1: PaymentTransaction, 2: User}
     */
    private function makePaymentContext(): array
    {
        $user = User::factory()->create([
            'name' => 'Portal Client',
            'email' => 'client@example.test',
        ]);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-TEST-001',
            'client_name' => $user->name,
            'client_email' => $user->email,
            'status' => 'sent',
            'subtotal' => 1000,
            'tax_percent' => 0,
            'tax_amount' => 0,
            'total' => 1000,
            'line_items' => [],
        ]);

        $transaction = PaymentTransaction::create([
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'gateway' => 'eps',
            'merchant_transaction_id' => 'INV-TEST-001-eps-'.uniqid(),
            'amount' => 1000,
            'status' => 'pending',
        ]);

        return [$invoice, $transaction, $user];
    }

    private function encryptIpn(array $payload, string $secret): string
    {
        $key = str_pad(substr($secret, 0, 32), 32, "\0");
        $iv = random_bytes(16);
        $cipher = openssl_encrypt(json_encode($payload), 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv).':'.base64_encode($cipher);
    }
}
