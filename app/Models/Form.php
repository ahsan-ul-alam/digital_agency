<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasAgencyCasts;

    protected $guarded = [];

    public function submissions()
    {
        return $this->hasMany(FormSubmission::class);
    }
}
