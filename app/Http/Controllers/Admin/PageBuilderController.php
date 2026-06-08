<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageBuilderController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/PageCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:160'],
        ]);

        $slug = filled($data['slug'] ?? null)
            ? Str::slug($data['slug'])
            : $this->uniqueSlug(Str::slug($data['name']));

        $page = Page::create([
            'name' => $data['name'],
            'slug' => $slug,
            'sections' => [],
            'is_published' => false,
        ]);

        return redirect()->route('admin.pages.builder', $page)->with('success', 'Page created. Design it in AR Builder.');
    }

    public function builder(Page $page): Response
    {
        return Inertia::render('Admin/ArBuilder', [
            'page' => $page,
            'forms' => Form::where('is_active', true)->orderBy('name')->get(['id', 'name', 'shortcode', 'fields', 'submit_label']),
        ]);
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:160'],
            'sections' => ['nullable', 'array'],
            'seo' => ['nullable', 'array'],
            'is_published' => ['boolean'],
        ]);

        $slug = Str::slug($data['slug']);
        if (Page::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
            return back()->withErrors(['slug' => 'This slug is already used by another page.']);
        }

        $page->update([
            'name' => $data['name'],
            'slug' => $slug,
            'sections' => $data['sections'] ?? [],
            'seo' => $data['seo'] ?? [],
            'is_published' => (bool) ($data['is_published'] ?? false),
        ]);

        return back()->with('success', ($data['is_published'] ?? false) ? 'Page published.' : 'Page saved.');
    }

    private function uniqueSlug(string $slug): string
    {
        $base = $slug;
        $candidate = $slug;
        $suffix = 2;

        while (Page::where('slug', $candidate)->exists()) {
            $candidate = $base.'-'.$suffix++;
        }

        return $candidate;
    }
}
