<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasAgencyCasts;

    protected $guarded = [];
}
