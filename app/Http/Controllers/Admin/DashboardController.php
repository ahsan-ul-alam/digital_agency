<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Lead;
use App\Models\Form;
use App\Models\HomepageSection;
use App\Models\MediaItem;
use App\Models\Package;
use App\Models\Page;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\JobOpening;
use App\Models\SiteSetting;
use App\Services\AnalyticsService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(AnalyticsService $analytics): Response
    {
        $settings = SiteSetting::all()->mapWithKeys(fn ($s) => [$s->key => $s->value])->toArray();
        $snapshot = $analytics->dashboardSnapshot();
        $cloudinary = $settings['cloudinary'] ?? [];
        $seo = $settings['seo'] ?? [];
        $unread = Lead::whereNull('read_at')->count();
        $user = auth()->user();

        return Inertia::render('Admin/Dashboard', [
            'greeting' => $this->greeting($user?->name),
            'summary' => [
                'unreadLeads' => $unread,
                'publishedPosts' => BlogPost::where('status', 'published')->count(),
                'activeServices' => Service::where('is_active', true)->count(),
                'mediaFiles' => MediaItem::count(),
            ],
            'kpis' => $snapshot['kpis'],
            'analytics' => $snapshot['kpis'],
            'trends' => [
                'pageViews' => $snapshot['page_view_trend'],
                'leads' => $snapshot['lead_trend'],
            ],
            'topPages' => $snapshot['top_pages'],
            'health' => [
                ['label' => 'Cloudinary', 'status' => filled($cloudinary['cloud_name'] ?? null) && filled($cloudinary['api_key'] ?? null) ? 'healthy' : 'warning', 'detail' => filled($cloudinary['cloud_name'] ?? null) ? 'Connected' : 'Not configured', 'href' => '/admin/cloudinary/settings'],
                ['label' => 'Database', 'status' => $this->databaseHealthy() ? 'healthy' : 'error', 'detail' => 'SQLite operational', 'href' => '/admin'],
                ['label' => 'Storage', 'status' => MediaItem::count() > 0 ? 'healthy' : 'warning', 'detail' => MediaItem::count().' media files', 'href' => '/admin/media'],
                ['label' => 'SEO Defaults', 'status' => filled($seo['title'] ?? null) && filled($seo['description'] ?? null) ? 'healthy' : 'warning', 'detail' => filled($seo['title'] ?? null) ? 'Meta configured' : 'Needs setup', 'href' => '/admin/site/settings'],
                ['label' => 'Homepage', 'status' => HomepageSection::where('is_active', true)->count() >= 3 ? 'healthy' : 'warning', 'detail' => HomepageSection::where('is_active', true)->count().' active sections', 'href' => '/admin/homepage'],
            ],
            'quickActions' => [
                ['label' => 'Create Page', 'description' => 'Launch AR Builder for a new page', 'href' => '/admin/pages/create', 'icon' => 'pages', 'tone' => 'primary'],
                ['label' => 'Add Service', 'description' => 'Publish a new service offering', 'href' => '/admin/services/create', 'icon' => 'services', 'tone' => 'default'],
                ['label' => 'Create Package', 'description' => 'Add a pricing plan', 'href' => '/admin/packages/create', 'icon' => 'packages', 'tone' => 'default'],
                ['label' => 'Write Blog Post', 'description' => 'Publish thought leadership content', 'href' => '/admin/blog/create', 'icon' => 'blog', 'tone' => 'default'],
                ['label' => 'Upload Media', 'description' => 'Add images to the media library', 'href' => '/admin/media', 'icon' => 'media', 'tone' => 'default'],
                ['label' => 'Review Leads', 'description' => $unread > 0 ? "{$unread} unread leads" : 'Open CRM pipeline', 'href' => '/admin/leads', 'icon' => 'leads', 'tone' => $unread > 0 ? 'alert' : 'default'],
            ],
            'setup' => [
                ['label' => 'Company information', 'done' => filled($settings['site']['name'] ?? null), 'href' => '/admin/site/settings'],
                ['label' => 'Theme colors configured', 'done' => filled($settings['theme']['primary'] ?? null), 'href' => '/admin/theme/settings'],
                ['label' => 'Cloudinary connected', 'done' => filled($cloudinary['cloud_name'] ?? null) && filled($cloudinary['api_key'] ?? null), 'href' => '/admin/cloudinary/settings'],
                ['label' => 'Homepage sections ready', 'done' => HomepageSection::where('is_active', true)->count() >= 3, 'href' => '/admin/homepage'],
                ['label' => 'Menus configured', 'done' => filled($settings['menus']['header']['items'] ?? null), 'href' => '/admin/menus'],
            ],
            'latestContacts' => Lead::latest()->take(5)->get(),
            'popularContent' => [
                ['label' => 'Highlighted Packages', 'value' => Package::where('is_highlighted', true)->orderBy('sort_order')->take(3)->pluck('name')->all(), 'href' => '/admin/packages'],
                ['label' => 'Featured Portfolio', 'value' => Portfolio::where('is_featured', true)->orderBy('sort_order')->take(3)->pluck('project_name')->all(), 'href' => '/admin/portfolio'],
                ['label' => 'Latest Blog Posts', 'value' => BlogPost::published()->latest('published_at')->take(3)->pluck('title')->all(), 'href' => '/admin/blog'],
            ],
            'pendingTasks' => collect([
                $unread > 0 ? ['label' => "Review {$unread} unread leads", 'href' => '/admin/leads'] : null,
                ! filled($cloudinary['cloud_name'] ?? null) ? ['label' => 'Connect Cloudinary for media uploads', 'href' => '/admin/cloudinary/settings'] : null,
                Page::where('is_published', false)->count() > 0 ? ['label' => Page::where('is_published', false)->count().' draft pages awaiting publish', 'href' => '/admin/pages'] : null,
                BlogPost::where('status', 'scheduled')->count() > 0 ? ['label' => BlogPost::where('status', 'scheduled')->count().' blog posts scheduled', 'href' => '/admin/blog'] : null,
                Form::where('is_active', true)->count() === 0 ? ['label' => 'Create your first lead capture form', 'href' => '/admin/forms/create'] : null,
            ])->filter()->values(),
        ]);
    }

    private function greeting(?string $name): string
    {
        $hour = (int) now()->format('H');
        $time = $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening');
        $first = $name ? explode(' ', trim($name))[0] : 'there';

        return "{$time}, {$first}";
    }

    private function databaseHealthy(): bool
    {
        try {
            DB::connection()->getPdo();

            return true;
        } catch (\Throwable) {
            return false;
        }
    }
}
