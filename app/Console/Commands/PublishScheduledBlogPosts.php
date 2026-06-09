<?php

namespace App\Console\Commands;

use App\Services\BlogPublishService;
use Illuminate\Console\Command;

class PublishScheduledBlogPosts extends Command
{
    protected $signature = 'blog:publish-scheduled';

    protected $description = 'Publish blog posts whose scheduled time has passed';

    public function handle(BlogPublishService $publisher): int
    {
        $count = $publisher->publishDuePosts();

        $this->info("Published {$count} scheduled post(s).");

        return self::SUCCESS;
    }
}
