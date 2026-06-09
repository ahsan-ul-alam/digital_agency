<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Models\SiteSetting;
use App\Services\MediaStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function picker(Request $request)
    {
        $search = $request->string('search')->trim();

        $items = MediaItem::query()
            ->when($search->isNotEmpty(), fn ($query) => $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(24);

        return response()->json($items);
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $type = $request->string('type')->trim();
        $cloudinary = SiteSetting::where('key', 'cloudinary')->first()?->value ?? [];

        $items = MediaItem::query()
            ->when($search->isNotEmpty(), fn ($query) => $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            }))
            ->when($type === 'image', fn ($query) => $query->where('mime_type', 'like', 'image/%'))
            ->when($type === 'video', fn ($query) => $query->where('mime_type', 'like', 'video/%'))
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Admin/MediaLibrary', [
            'items' => $items,
            'filters' => [
                'search' => $search->toString(),
                'type' => in_array($type->toString(), ['image', 'video'], true) ? $type->toString() : 'all',
            ],
            'stats' => [
                'total' => MediaItem::count(),
                'images' => MediaItem::where('mime_type', 'like', 'image/%')->count(),
                'videos' => MediaItem::where('mime_type', 'like', 'video/%')->count(),
                'storage_bytes' => (int) MediaItem::sum('size'),
            ],
            'cloudinaryConnected' => filled($cloudinary['cloud_name'] ?? null)
                && filled($cloudinary['api_key'] ?? null)
                && filled($cloudinary['api_secret'] ?? null),
        ]);
    }

    public function editorUpload(Request $request, MediaStorageService $media)
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,svg', 'max:10240'],
        ]);

        $stored = $media->store($data['file'], 'arsoftbd/editor', recordInLibrary: true);

        return response()->json([
            'url' => $stored['secure_url'] ?? $stored['url'] ?? $stored['path'] ?? null,
            'media' => $stored,
        ]);
    }

    public function store(Request $request, MediaStorageService $media): RedirectResponse
    {
        $data = $request->validate([
            'upload_file' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,svg,mp4,webm,mov,avi', 'max:51200'],
            'name' => ['nullable', 'string', 'max:160'],
            'alt_text' => ['nullable', 'string', 'max:220'],
        ]);

        $stored = $media->store($data['upload_file'], 'arsoftbd/library', recordInLibrary: true);

        $item = MediaItem::findOrFail($stored['media_item_id']);
        $item->update([
            'name' => $data['name'] ?: $item->name,
            'alt_text' => $data['alt_text'] ?? null,
        ]);

        return back()->with('success', 'Media uploaded successfully.');
    }

    public function update(Request $request, MediaItem $mediaItem): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'alt_text' => ['nullable', 'string', 'max:220'],
        ]);

        $mediaItem->update($data);

        return back()->with('success', 'Media updated.');
    }

    public function destroy(MediaItem $mediaItem): RedirectResponse
    {
        $mediaItem->delete();

        return back()->with('success', 'Media deleted.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $deleted = MediaItem::whereIn('id', $ids)->delete();

        return back()->with('success', $deleted.' media item(s) deleted.');
    }
}
