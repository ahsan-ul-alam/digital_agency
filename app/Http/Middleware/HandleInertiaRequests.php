<?php

namespace App\Http\Middleware;

use App\Models\AdminNotification;
use App\Support\AdminEditResolver;
use App\Support\AdminNavigation;
use App\Support\SiteCache;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => function () use ($request) {
                    $user = $request->user();

                    if (! $user) {
                        return null;
                    }

                    $user->loadMissing('role');

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'account_type' => $user->account_type ?? 'admin',
                        'role' => $user->role?->only('id', 'name', 'slug'),
                        'permissions' => $user->permissionSlugs(),
                        'is_super_admin' => $user->isSuperAdmin(),
                        'is_client' => $user->isClient(),
                    ];
                },
            ],
            'adminNav' => fn () => $request->is('admin', 'admin/*') ? AdminNavigation::groupsFor($request->user()) : null,
            'siteBranding' => fn () => SiteCache::branding(),
            'theme' => fn () => SiteCache::theme(),
            'menus' => fn () => SiteCache::menus(),
            'adminEdit' => fn () => AdminEditResolver::resolve($request),
            'notificationUnread' => fn () => $request->user()
                ? AdminNotification::where('user_id', $request->user()->id)->whereNull('read_at')->count()
                : 0,
        ];
    }
}
