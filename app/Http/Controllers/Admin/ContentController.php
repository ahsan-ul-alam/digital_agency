<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\ClientLogo;
use App\Models\ContactSubmission;
use App\Models\Faq;
use App\Models\HomepageSection;
use App\Models\Package;
use App\Models\Page;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Statistic;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\JobOpening;
use App\Services\BlogPublishService;
use App\Services\MediaStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    private array $modules = [
        'homepage' => [
            'model' => HomepageSection::class,
            'title' => 'Homepage Sections',
            'description' => 'Hero, about, process and bottom CTA content.',
            'list_columns' => ['section_key', 'title', 'is_active', 'sort_order'],
            'columns' => ['section_key', 'title', 'subtitle', 'content', 'payload', 'media', 'is_active', 'sort_order'],
        ],
        'logos' => [
            'model' => ClientLogo::class,
            'title' => 'Trusted Logos',
            'description' => 'Client logos shown below the hero.',
            'list_columns' => ['name', 'url', 'is_active', 'sort_order'],
            'columns' => ['name', 'logo_path', 'logo_media', 'url', 'is_active', 'sort_order'],
        ],
        'services' => [
            'model' => Service::class,
            'title' => 'Services',
            'description' => 'Service offerings on the homepage and services page.',
            'list_columns' => ['name', 'slug', 'is_featured', 'is_active', 'sort_order'],
            'columns' => ['name', 'slug', 'icon', 'banner_path', 'banner_media', 'excerpt', 'description', 'benefits', 'seo', 'is_featured', 'is_active', 'sort_order'],
        ],
        'statistics' => [
            'model' => Statistic::class,
            'title' => 'Statistics',
            'description' => 'Counter stats displayed in the hero area.',
            'list_columns' => ['label', 'value', 'suffix', 'is_active'],
            'columns' => ['label', 'value', 'suffix', 'is_active', 'sort_order'],
        ],
        'portfolio' => [
            'model' => Portfolio::class,
            'title' => 'Portfolio',
            'description' => 'Case studies and featured project work.',
            'list_columns' => ['project_name', 'category', 'is_featured', 'is_active'],
            'columns' => ['project_name', 'slug', 'client', 'category', 'image_path', 'image_media', 'url', 'excerpt', 'description', 'seo', 'is_featured', 'is_active', 'sort_order'],
        ],
        'packages' => [
            'model' => Package::class,
            'title' => 'Packages',
            'description' => 'Pricing tiers and plan features.',
            'list_columns' => ['name', 'price', 'duration', 'is_highlighted', 'is_active'],
            'columns' => ['name', 'type', 'price', 'duration', 'features', 'button_text', 'button_url', 'is_highlighted', 'is_active', 'sort_order'],
        ],
        'testimonials' => [
            'model' => Testimonial::class,
            'title' => 'Testimonials',
            'description' => 'Client reviews and ratings.',
            'list_columns' => ['client_name', 'company', 'rating', 'is_active'],
            'columns' => ['client_name', 'designation', 'company', 'photo_path', 'photo_media', 'review', 'rating', 'is_active', 'sort_order'],
        ],
        'team' => [
            'model' => TeamMember::class,
            'title' => 'Team',
            'description' => 'Team member profiles and photos.',
            'list_columns' => ['name', 'position', 'is_active', 'sort_order'],
            'columns' => ['name', 'position', 'photo_path', 'photo_media', 'bio', 'social_links', 'is_active', 'sort_order'],
        ],
        'faqs' => [
            'model' => Faq::class,
            'title' => 'FAQs',
            'description' => 'Frequently asked questions on the homepage.',
            'list_columns' => ['question', 'category', 'is_active', 'sort_order'],
            'columns' => ['question', 'answer', 'category', 'is_active', 'sort_order'],
        ],
        'categories' => [
            'model' => BlogCategory::class,
            'title' => 'Blog Categories',
            'description' => 'Organize blog posts by category.',
            'list_columns' => ['name', 'slug'],
            'columns' => ['name', 'slug'],
        ],
        'blog' => [
            'model' => BlogPost::class,
            'title' => 'Blog Posts',
            'description' => 'Publish and manage blog articles.',
            'list_columns' => ['title', 'slug', 'status', 'published_at', 'scheduled_at'],
            'columns' => ['title', 'slug', 'blog_category_id', 'thumbnail_path', 'thumbnail_media', 'excerpt', 'content', 'tags', 'seo', 'status', 'published_at', 'scheduled_at'],
        ],
        'careers' => [
            'model' => JobOpening::class,
            'title' => 'Careers',
            'description' => 'Open roles shown on the public careers page.',
            'list_columns' => ['title', 'department', 'location', 'employment_type', 'is_active'],
            'columns' => ['title', 'slug', 'department', 'location', 'employment_type', 'excerpt', 'description', 'requirements', 'seo', 'is_active', 'sort_order'],
        ],
        'pages' => [
            'model' => Page::class,
            'title' => 'Pages',
            'description' => 'About, legal and custom CMS pages.',
            'list_columns' => ['name', 'slug', 'is_published'],
            'columns' => ['name', 'slug', 'banner_path', 'banner_media', 'content', 'sections', 'seo', 'is_published'],
        ],
        'contacts' => [
            'model' => ContactSubmission::class,
            'title' => 'Inquiries',
            'description' => 'Hero form and contact page submissions.',
            'list_columns' => ['name', 'email', 'service', 'read_at'],
            'columns' => ['name', 'email', 'phone', 'company', 'service', 'budget', 'message', 'read_at'],
            'creatable' => false,
        ],
    ];

    public function index(string $module): Response
    {
        $config = $this->config($module);

        if ($module === 'contacts') {
            return Inertia::render('Admin/ContactsIndex', [
                'items' => ContactSubmission::orderByDesc('id')->paginate(20),
                'stats' => [
                    'total' => ContactSubmission::count(),
                    'unread' => ContactSubmission::whereNull('read_at')->count(),
                ],
            ]);
        }

        return Inertia::render('Admin/ModuleIndex', [
            'module' => $module,
            'config' => $this->presentConfig($config),
            'items' => $config['model']::orderByDesc('id')->paginate(20),
        ]);
    }

    public function showInquiry(int $id): Response
    {
        $inquiry = ContactSubmission::findOrFail($id);

        if (! $inquiry->read_at) {
            $inquiry->update(['read_at' => now()]);
            $inquiry->refresh();
        }

        return Inertia::render('Admin/ContactInquiry', [
            'inquiry' => $inquiry,
        ]);
    }

    public function create(string $module): Response|RedirectResponse
    {
        $config = $this->config($module);
        abort_if(($config['creatable'] ?? true) === false, 404);

        if ($module === 'pages') {
            return redirect()->route('admin.pages.create');
        }

        return Inertia::render('Admin/ModuleForm', [
            'module' => $module,
            'config' => $this->presentConfig($config),
            'item' => null,
            'meta' => $this->formMeta($module),
        ]);
    }

    public function store(Request $request, string $module, MediaStorageService $media, BlogPublishService $blogPublisher): RedirectResponse
    {
        $config = $this->config($module);
        abort_if(($config['creatable'] ?? true) === false, 404);
        $config['model']::create($this->payload($request, $config, $media, $module, null, $blogPublisher));

        return redirect()->route('admin.modules.index', $module)->with('success', $config['title'].' saved.');
    }

    public function edit(string $module, int $id): Response|RedirectResponse
    {
        if ($module === 'contacts') {
            return redirect()->route('admin.contacts.show', $id);
        }

        $config = $this->config($module);

        return Inertia::render('Admin/ModuleForm', [
            'module' => $module,
            'config' => $this->presentConfig($config),
            'item' => $config['model']::findOrFail($id),
            'meta' => $this->formMeta($module),
        ]);
    }

    public function update(Request $request, string $module, int $id, MediaStorageService $media, BlogPublishService $blogPublisher): RedirectResponse
    {
        abort_if($module === 'contacts', 403, 'Inquiries cannot be edited.');

        $config = $this->config($module);
        $item = $config['model']::findOrFail($id);
        $item->update($this->payload($request, $config, $media, $module, $id, $blogPublisher));

        return redirect()->route('admin.modules.index', $module)->with('success', $config['title'].' updated.');
    }

    public function destroy(string $module, int $id): RedirectResponse
    {
        $config = $this->config($module);
        $config['model']::findOrFail($id)->delete();

        if ($module === 'contacts') {
            return redirect()->route('admin.modules.index', 'contacts')->with('success', 'Inquiry deleted.');
        }

        return back()->with('success', $config['title'].' item deleted.');
    }

    public function bulkDestroy(Request $request, string $module): RedirectResponse
    {
        $config = $this->config($module);
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $deleted = $config['model']::whereIn('id', $ids)->delete();

        return back()->with('success', $deleted.' '.str($config['title'])->lower().' item(s) deleted.');
    }

    private function config(string $module): array
    {
        abort_unless(isset($this->modules[$module]), 404);

        return $this->modules[$module];
    }

    private function presentConfig(array $config): array
    {
        return [
            'title' => $config['title'],
            'description' => $config['description'] ?? '',
            'columns' => $config['columns'],
            'list_columns' => $config['list_columns'] ?? array_slice($config['columns'], 0, 5),
            'creatable' => $config['creatable'] ?? true,
        ];
    }

    private function formMeta(string $module): array
    {
        return match ($module) {
            'blog' => [
                'categories' => BlogCategory::orderBy('name')->get(['id', 'name']),
            ],
            default => [],
        };
    }

    private function payload(Request $request, array $config, MediaStorageService $media, string $module, ?int $exceptId = null, ?BlogPublishService $blogPublisher = null): array
    {
        $data = $request->only($config['columns']);

        foreach ($config['columns'] as $column) {
            if (str_ends_with($column, '_path')) {
                $fileField = str_replace('_path', '_file', $column);
                if ($request->hasFile($fileField)) {
                    $stored = $media->store($request->file($fileField), 'arsoftbd/'.$module);
                    $data[$column] = $stored['secure_url'] ?? $stored['url'] ?? $stored['path'] ?? null;

                    $mediaColumn = str_replace('_path', '_media', $column);
                    if (in_array($mediaColumn, $config['columns'], true)) {
                        $data[$mediaColumn] = $stored;
                    }
                }
            }
        }

        foreach (['features', 'benefits', 'seo', 'tags', 'sections', 'social_links', 'payload', 'value', 'media', 'logo_media', 'banner_media', 'image_media', 'photo_media', 'thumbnail_media', 'metadata'] as $field) {
            if (array_key_exists($field, $data) && is_string($data[$field])) {
                $decoded = json_decode($data[$field], true);
                $data[$field] = json_last_error() === JSON_ERROR_NONE ? $decoded : array_values(array_filter(array_map('trim', explode("\n", $data[$field]))));
            }
        }

        foreach (['is_active', 'is_featured', 'is_highlighted', 'is_published'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = (bool) $data[$field];
            }
        }

        if (in_array('slug', $config['columns'], true) && ! filled($data['slug'] ?? null)) {
            $source = $data['name'] ?? $data['title'] ?? $data['project_name'] ?? null;
            $data['slug'] = filled($source) ? Str::slug($source) : Str::random(8);
            $data['slug'] = $this->uniqueSlug($data['slug'], $config['model'], $exceptId);
        }

        if ($module === 'blog' && $blogPublisher) {
            $data = $blogPublisher->normalizePayload($data);
        }

        return $data;
    }

    private function uniqueSlug(string $slug, string $modelClass, ?int $exceptId = null): string
    {
        $base = $slug;
        $candidate = $slug;
        $suffix = 2;

        while ($modelClass::query()
            ->when($exceptId, fn ($query) => $query->where('id', '!=', $exceptId))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = $base.'-'.$suffix++;
        }

        return $candidate;
    }
}
