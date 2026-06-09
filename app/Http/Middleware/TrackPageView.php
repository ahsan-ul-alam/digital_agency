<?php

namespace App\Http\Middleware;

use App\Services\AnalyticsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    public function __construct(private AnalyticsService $analytics) {}

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        if (! $this->shouldTrack($request, $response)) {
            return;
        }

        try {
            $this->analytics->record(
                'page_view',
                '/'.trim($request->path(), '/'),
                $request->route()?->getName(),
            );
        } catch (\Throwable) {
            // Analytics should never break the request cycle.
        }
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        if (! $response->isSuccessful() || ! $request->isMethod('GET')) {
            return false;
        }

        if ($request->is('admin', 'admin/*', 'portal', 'portal/*', 'login', 'logout', 'up', 'build/*')) {
            return false;
        }

        if ($request->ajax() || $request->expectsJson()) {
            return false;
        }

        return true;
    }
}
