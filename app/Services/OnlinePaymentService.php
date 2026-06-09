<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\PaymentTransaction;
use App\Models\User;
use Illuminate\Support\Str;

class OnlinePaymentService
{
    public function __construct(private InvoicePaymentService $payments) {}

    public function createTransaction(Invoice $invoice, User $user, string $gateway, int $amount): PaymentTransaction
    {
        return PaymentTransaction::create([
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'gateway' => $gateway,
            'merchant_transaction_id' => $this->merchantTransactionId($invoice, $gateway),
            'amount' => $amount,
            'status' => 'pending',
        ]);
    }

    public function markGatewayReference(PaymentTransaction $transaction, ?string $gatewayTransactionId, array $meta = []): PaymentTransaction
    {
        $transaction->update([
            'gateway_transaction_id' => $gatewayTransactionId ?: $transaction->merchant_transaction_id,
            'meta' => array_merge($transaction->meta ?? [], $meta),
        ]);

        return $transaction->refresh();
    }

    public function complete(PaymentTransaction $transaction, array $meta = []): PaymentTransaction
    {
        if ($transaction->isSuccess()) {
            return $transaction;
        }

        $transaction->update([
            'status' => 'success',
            'completed_at' => now(),
            'meta' => array_merge($transaction->meta ?? [], $meta),
        ]);

        $method = $transaction->gateway === 'bkash' ? 'bkash' : 'eps';

        $this->payments->record($transaction->invoice, [
            'amount' => $transaction->amount,
            'method' => $method,
            'reference' => $transaction->gateway_transaction_id ?? $transaction->merchant_transaction_id,
            'paid_at' => now(),
            'notes' => ucfirst($transaction->gateway).' online payment',
        ]);

        return $transaction->refresh();
    }

    public function fail(PaymentTransaction $transaction, string $reason, array $meta = []): PaymentTransaction
    {
        if ($transaction->isSuccess()) {
            return $transaction;
        }

        $transaction->update([
            'status' => 'failed',
            'meta' => array_merge($transaction->meta ?? [], $meta, ['failure_reason' => $reason]),
        ]);

        return $transaction->refresh();
    }

    public function cancel(PaymentTransaction $transaction, array $meta = []): PaymentTransaction
    {
        if ($transaction->isSuccess()) {
            return $transaction;
        }

        $transaction->update([
            'status' => 'cancelled',
            'meta' => array_merge($transaction->meta ?? [], $meta),
        ]);

        return $transaction->refresh();
    }

    public function findByMerchantTransactionId(string $merchantTransactionId): ?PaymentTransaction
    {
        return PaymentTransaction::where('merchant_transaction_id', $merchantTransactionId)->first();
    }

    public function findByGatewayTransactionId(string $gateway, string $gatewayTransactionId): ?PaymentTransaction
    {
        return PaymentTransaction::query()
            ->where('gateway', $gateway)
            ->where('gateway_transaction_id', $gatewayTransactionId)
            ->first();
    }

    private function merchantTransactionId(Invoice $invoice, string $gateway): string
    {
        return strtoupper($gateway).$invoice->id.now()->format('ymdHis').Str::upper(Str::random(6));
    }
}
