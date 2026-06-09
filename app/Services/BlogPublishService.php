<?php

namespace App\Services;

use App\Models\BlogPost;

class BlogPublishService
{
    public function publishDuePosts(): int
    {
        $posts = BlogPost::query()
            ->where('status', 'scheduled')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->get();

        foreach ($posts as $post) {
            $post->update([
                'status' => 'published',
                'published_at' => $post->scheduled_at,
                'scheduled_at' => null,
            ]);
        }

        return $posts->count();
    }

    public function normalizePayload(array $data): array
    {
        $status = $data['status'] ?? 'draft';

        if ($status === 'published') {
            $data['published_at'] = filled($data['published_at'] ?? null)
                ? $data['published_at']
                : now()->toDateTimeString();
            $data['scheduled_at'] = null;
        }

        if ($status === 'scheduled') {
            $data['published_at'] = null;

            if (! filled($data['scheduled_at'] ?? null)) {
                $data['scheduled_at'] = now()->addHour()->toDateTimeString();
            }
        }

        if ($status === 'draft') {
            $data['published_at'] = null;
            $data['scheduled_at'] = null;
        }

        return $data;
    }
}
