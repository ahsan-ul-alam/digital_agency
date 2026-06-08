<?php

namespace App\Models;

use App\Models\Concerns\HasAgencyCasts;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasAgencyCasts;

    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }
}
