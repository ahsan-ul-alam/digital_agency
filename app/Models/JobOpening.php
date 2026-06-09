<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;

class JobOpening extends Model
{
    use HasAgencyCasts;

    public const EMPLOYMENT_TYPES = [
        'full-time' => 'Full-time',
        'part-time' => 'Part-time',
        'contract' => 'Contract',
        'remote' => 'Remote',
        'internship' => 'Internship',
    ];

    protected $guarded = [];

    protected $appends = ['employment_type_label'];

    public function getEmploymentTypeLabelAttribute(): string
    {
        return self::EMPLOYMENT_TYPES[$this->employment_type] ?? ucfirst(str_replace('-', ' ', $this->employment_type));
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
