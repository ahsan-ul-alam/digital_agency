@php
    use App\Models\SiteSetting;
    use App\Support\ThemePalette;

    $siteBranding = SiteSetting::where('key', 'site')->first()?->value ?? [];
    $theme = array_merge(ThemePalette::defaults(), SiteSetting::where('key', 'theme')->first()?->value ?? []);
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-primary" content="{{ $theme['primary'] }}">
        <style>:root { {{ ThemePalette::cssVariables($theme) }} }</style>
        @if(!empty($siteBranding['favicon']))
            <link rel="icon" href="{{ $siteBranding['favicon'] }}">
        @endif
        <title inertia>{{ $siteBranding['name'] ?? config('app.name', 'AR Soft BD') }}</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
