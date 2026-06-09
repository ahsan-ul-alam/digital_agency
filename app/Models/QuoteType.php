<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteType extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
