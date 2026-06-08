<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Support\AdminEditResolver;
use App\Support\AdminNavigation;
use App\Support\MenuSettings;
use App\Support\ThemePalette;
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
                'user' => fn () => $request->user()?->only('id', 'name', 'email'),
            ],
            'adminNav' => fn () => $request->is('admin', 'admin/*') ? AdminNavigation::groups() : null,
            'siteBranding' => fn () => SiteSetting::where('key', 'site')->first()?->value ?? [],
            'theme' => fn () => array_merge(
                ThemePalette::defaults(),
                SiteSetting::where('key', 'theme')->first()?->value ?? []
            ),
            'menus' => fn () => MenuSettings::get(),
            'adminEdit' => fn () => AdminEditResolver::resolve($request),
        ];
    }
}
