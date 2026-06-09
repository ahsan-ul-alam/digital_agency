<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\ClientLogo;
use App\Models\ContactSubmission;
use App\Services\LeadService;
use App\Models\Form;
use App\Models\Faq;
use App\Models\HomepageSection;
use App\Models\JobOpening;
use App\Models\Package;
use App\Models\Page;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Statistic;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Support\SeoBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SiteController extends Controller
{
    public function home(): InertiaResponse
    {
        $settings = $this->settings();
        $faqs = Faq::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Public/Home', [
            'settings' => $settings,
            'seo' => SeoBuilder::forHome($settings, $faqs->all()),
            'sections' => HomepageSection::where('is_active', true)->orderBy('sort_order')->get()->keyBy('section_key'),
            'logos' => ClientLogo::where('is_active', true)->orderBy('sort_order')->get(),
            'services' => Service::where('is_active', true)->orderBy('sort_order')->get(),
            'stats' => Statistic::where('is_active', true)->orderBy('sort_order')->get(),
            'portfolios' => Portfolio::where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->get(),
            'packages' => Package::where('is_active', true)->orderByDesc('is_highlighted')->orderBy('sort_order')->get(),
            'testimonials' => Testimonial::where('is_active', true)->orderBy('sort_order')->get(),
            'team' => TeamMember::where('is_active', true)->orderBy('sort_order')->get(),
            'faqs' => $faqs,
            'posts' => BlogPost::with('category')->published()->latest('published_at')->take(3)->get(),
        ]);
    }

    public function services(): InertiaResponse
    {
        $settings = $this->settings();
        $items = Service::where('is_active', true)->orderBy('sort_order')->get();
        $sections = HomepageSection::where('is_active', true)->get()->keyBy('section_key');

        return Inertia::render('Public/ServicesPage', [
            'settings' => $settings,
            'seo' => SeoBuilder::forListing('services', 'Software solutions that solve business problems', $settings, $items->all()),
            'services' => $items,
            'portfolios' => Portfolio::where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->take(3)->get(),
            'process' => $sections->get('process'),
            'contactCta' => $sections->get('contact_cta'),
        ]);
    }

    public function service(Service $service): InertiaResponse
    {
        abort_unless($service->is_active, 404);

        $settings = $this->settings();
        $sections = HomepageSection::where('is_active', true)->get()->keyBy('section_key');

        return Inertia::render('Public/Detail', [
            'settings' => $settings,
            'seo' => SeoBuilder::forDetail('service', $service, $settings),
            'kind' => 'service',
            'item' => $service,
            'contactCta' => $sections->get('contact_cta'),
        ]);
    }

    public function packages(): InertiaResponse
    {
        $settings = $this->settings();
        $items = Package::where('is_active', true)->orderByDesc('is_highlighted')->orderBy('sort_order')->get();
        $sections = HomepageSection::where('is_active', true)->get()->keyBy('section_key');

        return Inertia::render('Public/PackagesPage', [
            'settings' => $settings,
            'seo' => SeoBuilder::forListing('packages', 'Engagement models for every growth stage', $settings, $items->all()),
            'packages' => $items,
            'process' => $sections->get('process'),
            'faqs' => Faq::where('is_active', true)->orderBy('sort_order')->take(6)->get(),
            'contactCta' => $sections->get('contact_cta'),
        ]);
    }

    public function portfolio(): InertiaResponse
    {
        $settings = $this->settings();
        $items = Portfolio::where('is_active', true)->orderBy('sort_order')->get();
        $sections = HomepageSection::where('is_active', true)->get()->keyBy('section_key');

        return Inertia::render('Public/PortfolioPage', [
            'settings' => $settings,
            'seo' => SeoBuilder::forListing('portfolio', 'Business transformation case studies', $settings, $items->all()),
            'items' => $items,
            'stats' => Statistic::where('is_active', true)->orderBy('sort_order')->get(),
            'contactCta' => $sections->get('contact_cta'),
        ]);
    }

    public function project(Portfolio $portfolio): InertiaResponse
    {
        abort_unless($portfolio->is_active, 404);

        $settings = $this->settings();
        $sections = HomepageSection::where('is_active', true)->get()->keyBy('section_key');

        return Inertia::render('Public/PortfolioCaseStudy', [
            'settings' => $settings,
            'seo' => SeoBuilder::forDetail('project', $portfolio, $settings),
            'item' => $portfolio,
            'related' => Portfolio::where('is_active', true)
                ->where('id', '!=', $portfolio->id)
                ->where('category', $portfolio->category)
                ->orderBy('sort_order')
                ->take(3)
                ->get(),
            'contactCta' => $sections->get('contact_cta'),
        ]);
    }

    public function blog(): InertiaResponse
    {
        $settings = $this->settings();
        $items = BlogPost::with('category')->published()->latest('published_at')->get();

        return Inertia::render('Public/Listing', [
            'settings' => $settings,
            'seo' => SeoBuilder::forListing('blog', 'Ideas on software, growth and digital operations', $settings, $items->all()),
            'kind' => 'blog',
            'title' => 'Ideas on software, growth and digital operations',
            'items' => $items,
        ]);
    }

    public function post(BlogPost $post): InertiaResponse
    {
        abort_unless($post->status === 'published' && (! $post->published_at || $post->published_at <= now()), 404);

        $settings = $this->settings();

        return Inertia::render('Public/Detail', [
            'settings' => $settings,
            'seo' => SeoBuilder::forDetail('post', $post->load('category'), $settings),
            'kind' => 'post',
            'item' => $post,
        ]);
    }

    public function about(): InertiaResponse
    {
        $settings = $this->settings();
        $page = Page::where('slug', 'about')->first();
        $sections = HomepageSection::where('is_active', true)->get()->keyBy('section_key');

        return Inertia::render('Public/AboutPage', [
            'settings' => $settings,
            'seo' => SeoBuilder::forPage($page, 'About AR Soft BD', $settings, '/about'),
            'page' => $page,
            'sections' => $sections,
            'stats' => Statistic::where('is_active', true)->orderBy('sort_order')->get(),
            'team' => TeamMember::where('is_active', true)->orderBy('sort_order')->get(),
            'contactCta' => $sections->get('contact_cta'),
        ]);
    }

    public function contact(): InertiaResponse
    {
        $settings = $this->settings();

        return Inertia::render('Public/Contact', [
            'settings' => $settings,
            'seo' => SeoBuilder::forContact($settings),
            'services' => Service::where('is_active', true)->orderBy('sort_order')->pluck('name'),
            'faqs' => Faq::where('is_active', true)->orderBy('sort_order')->take(8)->get(),
        ]);
    }

    public function submitContact(Request $request, LeadService $leads): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:60'],
            'company' => ['nullable', 'string', 'max:160'],
            'service' => ['nullable', 'string', 'max:160'],
            'budget' => ['nullable', 'string', 'max:80'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $submission = ContactSubmission::create($data);
        $referer = (string) $request->headers->get('referer', '');
        $source = str_contains($referer, '/contact') ? 'contact_page' : 'hero_form';

        $leads->recordFromContact($data, $source, $submission->id);

        return back()->with('success', 'Thanks. Your project inquiry has been received.');
    }

    public function careers(): InertiaResponse
    {
        $settings = $this->settings();
        $items = JobOpening::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Public/Careers', [
            'settings' => $settings,
            'seo' => SeoBuilder::forStatic('Careers at AR Soft BD', 'Join our team building premium software, ecommerce, and agency platforms.', '/careers'),
            'openings' => $items,
        ]);
    }

    public function career(JobOpening $jobOpening): InertiaResponse
    {
        abort_unless($jobOpening->is_active, 404);

        $settings = $this->settings();

        return Inertia::render('Public/CareerShow', [
            'settings' => $settings,
            'seo' => SeoBuilder::forDetail('career', $jobOpening, $settings),
            'opening' => $jobOpening,
        ]);
    }

    public function applyCareer(Request $request, JobOpening $jobOpening, LeadService $leads): RedirectResponse
    {
        abort_unless($jobOpening->is_active, 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:60'],
            'company' => ['nullable', 'string', 'max:160'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $leads->recordFromCareer([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'role' => $jobOpening->title,
            'message' => trim(($data['message'] ?? '').($data['portfolio_url'] ? "\n\nPortfolio: ".$data['portfolio_url'] : '')),
            'source_meta' => [
                'job_opening_id' => $jobOpening->id,
                'job_slug' => $jobOpening->slug,
                'department' => $jobOpening->department,
                'portfolio_url' => $data['portfolio_url'] ?? null,
            ],
        ]);

        return back()->with('success', 'Thanks! Your application has been received. Our team will review it shortly.');
    }

    public function page(Page $page): InertiaResponse
    {
        abort_unless($page->is_published, 404);

        $settings = $this->settings();

        return Inertia::render('Public/StaticPage', [
            'settings' => $settings,
            'seo' => SeoBuilder::forPage($page, $page->name, $settings, '/'.$page->slug),
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
        $entries = collect([
            ['loc' => url('/'), 'lastmod' => now(), 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => url('/about'), 'lastmod' => Page::where('slug', 'about')->value('updated_at'), 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => url('/services'), 'lastmod' => Service::where('is_active', true)->max('updated_at'), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/packages'), 'lastmod' => Package::where('is_active', true)->max('updated_at'), 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/portfolio'), 'lastmod' => Portfolio::where('is_active', true)->max('updated_at'), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/blog'), 'lastmod' => BlogPost::published()->max('updated_at'), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => url('/contact'), 'lastmod' => now(), 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => url('/careers'), 'lastmod' => JobOpening::where('is_active', true)->max('updated_at'), 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/quote'), 'lastmod' => now(), 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => url('/book'), 'lastmod' => now(), 'changefreq' => 'monthly', 'priority' => '0.8'],
        ]);

        $entries = $entries->merge(
            Service::where('is_active', true)->get(['slug', 'updated_at'])->map(fn ($item) => [
                'loc' => url("/services/{$item->slug}"),
                'lastmod' => $item->updated_at,
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ])
        )->merge(
            Portfolio::where('is_active', true)->get(['slug', 'updated_at'])->map(fn ($item) => [
                'loc' => url("/portfolio/{$item->slug}"),
                'lastmod' => $item->updated_at,
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ])
        )->merge(
            BlogPost::published()->get(['slug', 'updated_at', 'published_at'])->map(fn ($item) => [
                'loc' => url("/blog/{$item->slug}"),
                'lastmod' => $item->updated_at ?? $item->published_at,
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ])
        )->merge(
            JobOpening::where('is_active', true)->get(['slug', 'updated_at'])->map(fn ($item) => [
                'loc' => url("/careers/{$item->slug}"),
                'lastmod' => $item->updated_at,
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ])
        )->merge(
            Page::where('is_published', true)->where('slug', '!=', 'about')->get(['slug', 'updated_at'])->map(fn ($item) => [
                'loc' => url("/{$item->slug}"),
                'lastmod' => $item->updated_at,
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ])
        );

        return Response::view('sitemap', ['entries' => $entries], 200, ['Content-Type' => 'application/xml']);
    }

    public function robots()
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /login',
            'Disallow: /admin/',
            'Sitemap: '.url('/sitemap.xml'),
        ];

        return response(implode("\n", $lines)."\n", 200, ['Content-Type' => 'text/plain']);
    }

    private function settings(): array
    {
        return \App\Support\SiteCache::settings();
    }
}
