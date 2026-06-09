<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    public const STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];

    public const STATUS_LABELS = [
        'draft' => 'Draft',
        'sent' => 'Sent',
        'paid' => 'Paid',
        'overdue' => 'Overdue',
        'cancelled' => 'Cancelled',
    ];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'line_items' => 'array',
            'due_date' => 'date',
            'paid_at' => 'datetime',
            'tax_percent' => 'decimal:2',
        ];
    }

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(InvoicePayment::class);
    }

    public function paidTotal(): int
    {
        return (int) $this->payments()->sum('amount');
    }

    public function balanceDue(): int
    {
        return max(0, (int) $this->total - $this->paidTotal());
    }

    public static function nextNumber(): string
    {
        $year = now()->format('Y');
        $last = static::where('invoice_number', 'like', "INV-{$year}-%")->orderByDesc('id')->first();
        $seq = $last ? ((int) substr($last->invoice_number, -4)) + 1 : 1;

        return sprintf('INV-%s-%04d', $year, $seq);
    }
}
