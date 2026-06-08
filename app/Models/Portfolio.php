<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasAgencyCasts;

    protected $guarded = [];
}
