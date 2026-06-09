<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lead extends Model
{
    use HasAgencyCasts;

    public const STATUSES = [
        'new',
        'contacted',
        'qualified',
        'proposal_sent',
        'won',
        'lost',
    ];

    public const STATUS_LABELS = [
        'new' => 'New',
        'contacted' => 'Contacted',
        'qualified' => 'Qualified',
        'proposal_sent' => 'Proposal Sent',
        'won' => 'Won',
        'lost' => 'Lost',
    ];

    public const SOURCES = [
        'contact_page' => 'Contact Page',
        'hero_form' => 'Homepage Form',
        'custom_form' => 'Custom Form',
        'quote_calculator' => 'Quote Calculator',
        'meeting_booking' => 'Meeting Booking',
        'career_application' => 'Career Application',
    ];

    protected $guarded = [];

    protected $appends = ['source_label', 'status_label'];

    protected function casts(): array
    {
        return [
            'source_meta' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LeadNote::class)->latest();
    }

    public function followups(): HasMany
    {
        return $this->hasMany(LeadFollowup::class)->orderBy('due_at');
    }

    public function clientUser(): HasOne
    {
        return $this->hasOne(User::class)->where('account_type', 'client');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->status] ?? ucfirst(str_replace('_', ' ', $this->status));
    }

    public function getSourceLabelAttribute(): string
    {
        return self::SOURCES[$this->source] ?? ucfirst(str_replace('_', ' ', $this->source));
    }
}
