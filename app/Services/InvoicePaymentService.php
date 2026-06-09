<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\User;

class InvoicePaymentService
{
    public function __construct(private AuditLogger $audit) {}

    public function record(Invoice $invoice, array $data, ?User $user = null): InvoicePayment
    {
        $payment = $invoice->payments()->create([
            'amount' => (int) $data['amount'],
            'method' => $data['method'],
            'reference' => $data['reference'] ?? null,
            'paid_at' => $data['paid_at'] ?? now(),
            'notes' => $data['notes'] ?? null,
            'recorded_by' => $user?->id,
        ]);

        $this->syncInvoiceStatus($invoice->refresh());

        $this->audit->log('invoice.payment_recorded', $invoice, $invoice->invoice_number, [
            'amount' => $payment->amount,
            'method' => $payment->method,
        ], $user?->id);

        return $payment;
    }

    public function syncInvoiceStatus(Invoice $invoice): Invoice
    {
        $paidTotal = (int) $invoice->payments()->sum('amount');

        if ($paidTotal >= (int) $invoice->total && $invoice->total > 0) {
            $invoice->update([
                'status' => 'paid',
                'paid_at' => $invoice->paid_at ?? now(),
            ]);
        } elseif ($invoice->status === 'paid' && $paidTotal < (int) $invoice->total) {
            $invoice->update([
                'status' => 'sent',
                'paid_at' => null,
            ]);
        }

        return $invoice->refresh();
    }
}
