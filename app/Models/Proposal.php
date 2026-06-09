<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proposal extends Model
{
    public const STATUSES = ['draft', 'sent', 'accepted', 'declined'];

    public const STATUS_LABELS = [
        'draft' => 'Draft',
        'sent' => 'Sent',
        'accepted' => 'Accepted',
        'declined' => 'Declined',
    ];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'line_items' => 'array',
            'valid_until' => 'date',
            'sent_at' => 'datetime',
            'tax_percent' => 'decimal:2',
        ];
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public static function nextNumber(): string
    {
        $year = now()->format('Y');
        $last = static::where('number', 'like', "PROP-{$year}-%")->orderByDesc('id')->first();
        $seq = $last ? ((int) substr($last->number, -4)) + 1 : 1;

        return sprintf('PROP-%s-%04d', $year, $seq);
    }
}
