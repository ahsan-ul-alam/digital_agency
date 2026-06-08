<?php

namespace App\Services;

use App\Models\MediaItem;
use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class MediaStorageService
{
    public function store(UploadedFile $file, string $folder = 'arsoftbd', bool $recordInLibrary = false): array
    {
        $settings = SiteSetting::where('key', 'cloudinary')->first()?->value ?? [];

        if ($this->configured($settings)) {
            return $this->storeCloudinary($file, $settings, $folder, $recordInLibrary);
        }

        return $this->storeLocal($file, $folder, $recordInLibrary);
    }

    public function optimizedUrl(?array $media, int $width = 1200): ?string
    {
        if (! $media) {
            return null;
        }

        $url = $media['secure_url'] ?? $media['url'] ?? null;
        if (! $url || ($media['disk'] ?? null) !== 'cloudinary') {
            return $url;
        }

        return str_replace('/upload/', "/upload/f_auto,q_auto,c_limit,w_{$width}/", $url);
    }

    private function configured(array $settings): bool
    {
        return filled($settings['cloud_name'] ?? null)
            && filled($settings['api_key'] ?? null)
            && filled($settings['api_secret'] ?? null);
    }

    private function resourceType(UploadedFile $file): string
    {
        return str_starts_with($file->getMimeType(), 'video/') ? 'video' : 'image';
    }

    private function defaultName(UploadedFile $file): string
    {
        return Str::of($file->getClientOriginalName())->beforeLast('.')->toString() ?: 'upload';
    }

    private function storeCloudinary(UploadedFile $file, array $settings, string $folder, bool $recordInLibrary): array
    {
        $timestamp = time();
        $folder = trim($settings['folder'] ?? $folder, '/') ?: 'arsoftbd';
        $resourceType = $this->resourceType($file);
        $params = array_filter([
            'folder' => $folder,
            'timestamp' => $timestamp,
            'upload_preset' => $settings['upload_preset'] ?? null,
        ]);
        ksort($params);

        $signatureBase = collect($params)->map(fn ($value, $key) => $key.'='.$value)->implode('&');
        $signature = sha1($signatureBase.$settings['api_secret']);

        $response = Http::attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
            ->asMultipart()
            ->post("https://api.cloudinary.com/v1_1/{$settings['cloud_name']}/{$resourceType}/upload", [
                ...$params,
                'api_key' => $settings['api_key'],
                'signature' => $signature,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Cloudinary upload failed: '.$response->body());
        }

        $payload = $response->json();
        $media = [
            'disk' => 'cloudinary',
            'resource_type' => $resourceType,
            'public_id' => $payload['public_id'] ?? null,
            'secure_url' => $payload['secure_url'] ?? null,
            'url' => $payload['secure_url'] ?? null,
            'width' => $payload['width'] ?? null,
            'height' => $payload['height'] ?? null,
            'format' => $payload['format'] ?? null,
            'bytes' => $payload['bytes'] ?? $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'metadata' => $payload,
        ];

        if ($recordInLibrary) {
            $item = MediaItem::create([
                'name' => $this->defaultName($file),
                'file_path' => $media['secure_url'],
                'disk' => 'cloudinary',
                'cloudinary_public_id' => $media['public_id'],
                'secure_url' => $media['secure_url'],
                'mime_type' => $media['mime_type'],
                'size' => $media['bytes'] ?? 0,
                'metadata' => $payload,
            ]);
            $media['media_item_id'] = $item->id;
        }

        return $media;
    }

    private function storeLocal(UploadedFile $file, string $folder, bool $recordInLibrary): array
    {
        $resourceType = $this->resourceType($file);
        $path = $file->storePublicly(trim($folder, '/') ?: 'media', 'public');
        $url = Storage::disk('public')->url($path);

        $media = [
            'disk' => 'local',
            'resource_type' => $resourceType,
            'public_id' => null,
            'secure_url' => $url,
            'url' => $url,
            'path' => $path,
            'bytes' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'metadata' => [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
            ],
        ];

        if ($recordInLibrary) {
            $item = MediaItem::create([
                'name' => $this->defaultName($file),
                'file_path' => $path,
                'disk' => 'local',
                'secure_url' => $url,
                'mime_type' => $media['mime_type'],
                'size' => $file->getSize() ?? 0,
                'metadata' => $media['metadata'],
            ]);
            $media['media_item_id'] = $item->id;
        }

        return $media;
    }
}
