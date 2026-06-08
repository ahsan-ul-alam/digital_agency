<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasAgencyCasts;

    protected $guarded = [];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
