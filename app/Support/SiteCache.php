<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class SiteCache
{
    public static function settings(): array
    {
        return Cache::remember('site.settings.all', now()->addMinutes(10), function () {
            return SiteSetting::all()->mapWithKeys(fn ($setting) => [$setting->key => $setting->value])->toArray();
        });
    }

    public static function get(string $key, mixed $default = []): mixed
    {
        return self::settings()[$key] ?? $default;
    }

    public static function branding(): array
    {
        return self::get('site', []);
    }

    public static function theme(): array
    {
        return array_merge(ThemePalette::defaults(), self::get('theme', []));
    }

    public static function menus(): array
    {
        return Cache::remember('site.menus', now()->addMinutes(10), fn () => MenuSettings::get());
    }

    public static function bust(): void
    {
        Cache::forget('site.settings.all');
        Cache::forget('site.menus');
    }
}
