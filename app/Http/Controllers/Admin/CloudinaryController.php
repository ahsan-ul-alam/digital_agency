<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class CloudinaryController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::where('key', 'cloudinary')->first()?->value ?? [
            'cloud_name' => '',
            'api_key' => '',
            'api_secret' => '',
            'upload_preset' => '',
            'folder' => 'arsoftbd',
        ];

        return Inertia::render('Admin/CloudinarySettings', [
            'settings' => $settings,
            'connected' => $this->isConfigured($settings),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'cloud_name' => ['nullable', 'string', 'max:120'],
            'api_key' => ['nullable', 'string', 'max:160'],
            'api_secret' => ['nullable', 'string', 'max:220'],
            'upload_preset' => ['nullable', 'string', 'max:160'],
            'folder' => ['nullable', 'string', 'max:160'],
        ]);

        SiteSetting::updateOrCreate(['key' => 'cloudinary'], ['value' => $data]);

        return back()->with('success', 'Cloudinary settings updated.');
    }

    public function test(): JsonResponse
    {
        $settings = SiteSetting::where('key', 'cloudinary')->first()?->value ?? [];

        if (! $this->isConfigured($settings)) {
            return response()->json([
                'ok' => false,
                'message' => 'Please fill in Cloud Name, API Key and API Secret first.',
            ]);
        }

        $timestamp = time();
        $params = ['timestamp' => $timestamp];
        ksort($params);
        $signatureBase = collect($params)->map(fn ($value, $key) => $key.'='.$value)->implode('&');
        $signature = sha1($signatureBase.$settings['api_secret']);

        $response = Http::get("https://api.cloudinary.com/v1_1/{$settings['cloud_name']}/resources/image", [
            'api_key' => $settings['api_key'],
            'timestamp' => $timestamp,
            'signature' => $signature,
            'max_results' => 1,
        ]);

        if ($response->successful()) {
            return response()->json([
                'ok' => true,
                'message' => 'Connected successfully. Image and video uploads will use Cloudinary.',
            ]);
        }

        return response()->json([
            'ok' => false,
            'message' => 'Connection failed. Check your credentials and try again.',
        ]);
    }

    private function isConfigured(array $settings): bool
    {
        return filled($settings['cloud_name'] ?? null)
            && filled($settings['api_key'] ?? null)
            && filled($settings['api_secret'] ?? null);
    }
}
