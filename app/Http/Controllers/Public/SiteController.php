<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\ClientLogo;
use App\Models\ContactSubmission;
use App\Models\Form;
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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SiteController extends Controller
{
    public function home(): InertiaResponse
    {
        return Inertia::render('Public/Home', [
            'settings' => $this->settings(),
            'sections' => HomepageSection::where('is_active', true)->orderBy('sort_order')->get()->keyBy('section_key'),
            'logos' => ClientLogo::where('is_active', true)->orderBy('sort_order')->get(),
            'services' => Service::where('is_active', true)->orderBy('sort_order')->get(),
            'stats' => Statistic::where('is_active', true)->orderBy('sort_order')->get(),
            'portfolios' => Portfolio::where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->get(),
            'packages' => Package::where('is_active', true)->orderByDesc('is_highlighted')->orderBy('sort_order')->get(),
            'testimonials' => Testimonial::where('is_active', true)->orderBy('sort_order')->get(),
            'team' => TeamMember::where('is_active', true)->orderBy('sort_order')->get(),
            'faqs' => Faq::where('is_active', true)->orderBy('sort_order')->get(),
            'posts' => BlogPost::with('category')->where('status', 'published')->latest('published_at')->take(3)->get(),
        ]);
    }

    public function services(): InertiaResponse
    {
        return Inertia::render('Public/Listing', [
            'settings' => $this->settings(),
            'kind' => 'services',
            'title' => 'Services built for ambitious teams',
            'items' => Service::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function service(Service $service): InertiaResponse
    {
        abort_unless($service->is_active, 404);

        return Inertia::render('Public/Detail', [
            'settings' => $this->settings(),
            'kind' => 'service',
            'item' => $service,
        ]);
    }

    public function packages(): InertiaResponse
    {
        return Inertia::render('Public/Listing', [
            'settings' => $this->settings(),
            'kind' => 'packages',
            'title' => 'Transparent packages for every growth stage',
            'items' => Package::where('is_active', true)->orderByDesc('is_highlighted')->orderBy('sort_order')->get(),
        ]);
    }

    public function portfolio(): InertiaResponse
    {
        return Inertia::render('Public/Listing', [
            'settings' => $this->settings(),
            'kind' => 'portfolio',
            'title' => 'Selected work across web, SaaS, ERP and ecommerce',
            'items' => Portfolio::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function project(Portfolio $portfolio): InertiaResponse
    {
        abort_unless($portfolio->is_active, 404);

        return Inertia::render('Public/Detail', [
            'settings' => $this->settings(),
            'kind' => 'project',
            'item' => $portfolio,
        ]);
    }

    public function blog(): InertiaResponse
    {
        return Inertia::render('Public/Listing', [
            'settings' => $this->settings(),
            'kind' => 'blog',
            'title' => 'Ideas on software, growth and digital operations',
            'items' => BlogPost::with('category')->where('status', 'published')->latest('published_at')->get(),
        ]);
    }

    public function post(BlogPost $post): InertiaResponse
    {
        abort_unless($post->status === 'published', 404);

        return Inertia::render('Public/Detail', [
            'settings' => $this->settings(),
            'kind' => 'post',
            'item' => $post->load('category'),
        ]);
    }

    public function about(): InertiaResponse
    {
        return Inertia::render('Public/StaticPage', [
            'settings' => $this->settings(),
            'title' => 'About AR Soft BD',
            'page' => Page::where('slug', 'about')->first(),
            'stats' => Statistic::where('is_active', true)->orderBy('sort_order')->get(),
            'team' => TeamMember::where('is_active', true)->orderBy('sort_order')->get(),
            'formsByShortcode' => $this->activeForms(),
        ]);
    }

    public function contact(): InertiaResponse
    {
        return Inertia::render('Public/Contact', [
            'settings' => $this->settings(),
            'services' => Service::where('is_active', true)->orderBy('sort_order')->pluck('name'),
        ]);
    }

    public function submitContact(Request $request): RedirectResponse
    {
        ContactSubmission::create($request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:60'],
            'company' => ['nullable', 'string', 'max:160'],
            'service' => ['nullable', 'string', 'max:160'],
            'budget' => ['nullable', 'string', 'max:80'],
            'message' => ['required', 'string', 'max:5000'],
        ]));

        return back()->with('success', 'Thanks. Your project inquiry has been received.');
    }

    public function page(Page $page): InertiaResponse
    {
        abort_unless($page->is_published, 404);

        return Inertia::render('Public/StaticPage', [
            'settings' => $this->settings(),
            'title' => $page->name,
            'page' => $page,
            'formsByShortcode' => $this->activeForms(),
        ]);
    }

    private function activeForms(): array
    {
        return Form::where('is_active', true)
            ->get(['id', 'name', 'shortcode', 'fields', 'submit_label', 'success_message'])
            ->keyBy('shortcode')
            ->all();
    }

    public function sitemap()
    {
        $base = url('/');
        $urls = collect(['', 'about', 'services', 'packages', 'portfolio', 'blog', 'contact'])
            ->map(fn ($path) => $base.($path ? '/'.$path : ''));

        $dynamic = collect()
            ->merge(Service::where('is_active', true)->pluck('slug')->map(fn ($slug) => "$base/services/$slug"))
            ->merge(Portfolio::where('is_active', true)->pluck('slug')->map(fn ($slug) => "$base/portfolio/$slug"))
            ->merge(BlogPost::where('status', 'published')->pluck('slug')->map(fn ($slug) => "$base/blog/$slug"))
            ->merge(Page::where('is_published', true)->pluck('slug')->map(fn ($slug) => "$base/$slug"));

        return Response::view('sitemap', ['urls' => $urls->merge($dynamic)], 200, ['Content-Type' => 'application/xml']);
    }

    public function robots()
    {
        return response("User-agent: *\nAllow: /\nSitemap: ".url('/sitemap.xml')."\n", 200, ['Content-Type' => 'text/plain']);
    }

    private function settings(): array
    {
        return SiteSetting::all()->mapWithKeys(fn ($setting) => [$setting->key => $setting->value])->toArray();
    }
}
