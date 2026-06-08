<?php

namespace App\Models\Concerns;

trait HasAgencyCasts
{
    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'media' => 'array',
            'logo_media' => 'array',
            'banner_media' => 'array',
            'image_media' => 'array',
            'photo_media' => 'array',
            'thumbnail_media' => 'array',
            'metadata' => 'array',
            'benefits' => 'array',
            'features' => 'array',
            'seo' => 'array',
            'tags' => 'array',
            'sections' => 'array',
            'social_links' => 'array',
            'value' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_highlighted' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
            'read_at' => 'datetime',
            'fields' => 'array',
            'data' => 'array',
        ];
    }
}
