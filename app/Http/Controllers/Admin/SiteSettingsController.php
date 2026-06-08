<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\MediaStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::all()->mapWithKeys(fn ($s) => [$s->key => $s->value])->toArray();

        return Inertia::render('Admin/SiteSettings', [
            'site' => $settings['site'] ?? ['name' => '', 'tagline' => '', 'logo' => '', 'favicon' => ''],
            'contact' => $settings['contact'] ?? ['email' => '', 'phone' => '', 'address' => '', 'map' => ''],
            'social' => $settings['social'] ?? ['facebook' => '', 'linkedin' => '', 'github' => '', 'twitter' => '', 'instagram' => ''],
            'seo' => $settings['seo'] ?? ['title' => '', 'description' => '', 'keywords' => ''],
        ]);
    }

    public function update(Request $request, MediaStorageService $media): RedirectResponse
    {
        $existingSite = SiteSetting::where('key', 'site')->first()?->value ?? [];

        $data = $request->validate([
            'site.name' => ['required', 'string', 'max:120'],
            'site.tagline' => ['nullable', 'string', 'max:220'],
            'site.logo' => ['nullable', 'string', 'max:500'],
            'site.favicon' => ['nullable', 'string', 'max:500'],
            'logo_file' => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:5120'],
            'favicon_file' => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp,ico', 'max:2048'],
            'contact.email' => ['nullable', 'email', 'max:160'],
            'contact.phone' => ['nullable', 'string', 'max:60'],
            'contact.address' => ['nullable', 'string', 'max:220'],
            'contact.map' => ['nullable', 'url', 'max:220'],
            'social.facebook' => ['nullable', 'string', 'max:220'],
            'social.linkedin' => ['nullable', 'string', 'max:220'],
            'social.github' => ['nullable', 'string', 'max:220'],
            'social.twitter' => ['nullable', 'string', 'max:220'],
            'social.instagram' => ['nullable', 'string', 'max:220'],
            'seo.title' => ['nullable', 'string', 'max:160'],
            'seo.description' => ['nullable', 'string', 'max:300'],
            'seo.keywords' => ['nullable', 'string', 'max:220'],
        ]);

        $site = [
            'name' => $data['site']['name'],
            'tagline' => $data['site']['tagline'] ?? '',
            'logo' => $existingSite['logo'] ?? '',
            'favicon' => $existingSite['favicon'] ?? '',
        ];

        if ($request->hasFile('logo_file')) {
            $stored = $media->store($request->file('logo_file'), 'arsoftbd/branding', recordInLibrary: true);
            $site['logo'] = $stored['secure_url'] ?? $stored['url'] ?? $site['logo'];
        } elseif (filled($data['site']['logo'] ?? null)) {
            $site['logo'] = $data['site']['logo'];
        }

        if ($request->hasFile('favicon_file')) {
            $stored = $media->store($request->file('favicon_file'), 'arsoftbd/branding', recordInLibrary: true);
            $site['favicon'] = $stored['secure_url'] ?? $stored['url'] ?? $site['favicon'];
        } elseif (filled($data['site']['favicon'] ?? null)) {
            $site['favicon'] = $data['site']['favicon'];
        }

        SiteSetting::updateOrCreate(['key' => 'site'], ['value' => $site]);
        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $data['contact']]);
        SiteSetting::updateOrCreate(['key' => 'social'], ['value' => $data['social']]);
        SiteSetting::updateOrCreate(['key' => 'seo'], ['value' => $data['seo']]);

        return back()->with('success', 'Site information updated.');
    }
}
