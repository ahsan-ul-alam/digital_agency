<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SeoBuilder
{
    public static function forHome(array $settings, array $faqs = []): array
    {
        $defaults = self::defaults($settings);
        $global = $settings['seo'] ?? [];

        $schema = [
            self::organizationSchema($settings),
            self::websiteSchema($settings),
            self::webPageSchema(
                name: $global['title'] ?? $defaults['site_name'],
                description: $global['description'] ?? $defaults['description'],
                url: url('/'),
            ),
        ];

        if ($faqs) {
            $schema[] = self::faqPageSchema($faqs);
        }

        return self::compose(
            title: $global['title'] ?? $defaults['site_name'].' | '.$defaults['tagline'],
            description: $global['description'] ?? $defaults['description'],
            keywords: $global['keywords'] ?? $defaults['keywords'],
            canonical: $global['canonical'] ?? url('/'),
            image: self::mediaUrl($global['og_image_media'] ?? null, $global['og_image'] ?? null) ?? $defaults['image'],
            type: 'website',
            robots: self::robots($global),
            settings: $settings,
            schema: $schema,
        );
    }

    public static function forListing(string $kind, string $heading, array $settings, array $items = []): array
    {
        $map = [
            'services' => [
                'title' => 'Software Development Services',
                'description' => 'Explore web, mobile, SaaS, ERP and ecommerce development services from '.self::siteName($settings).'.',
                'path' => '/services',
            ],
            'packages' => [
                'title' => 'Pricing Packages',
                'description' => 'Transparent software development packages and pricing plans for startups and growing businesses.',
                'path' => '/packages',
            ],
            'portfolio' => [
                'title' => 'Portfolio & Case Studies',
                'description' => 'Selected software projects, SaaS products, ERP builds and ecommerce platforms delivered by our team.',
                'path' => '/portfolio',
            ],
            'blog' => [
                'title' => 'Blog & Insights',
                'description' => 'Articles on software development, digital products, growth and technology operations.',
                'path' => '/blog',
            ],
        ];

        $meta = $map[$kind] ?? [
            'title' => $heading,
            'description' => self::defaults($settings)['description'],
            'path' => '/'.Str::slug($kind),
        ];

        $canonical = url($meta['path']);
        $title = $meta['title'].' | '.self::siteName($settings);
        $description = Str::limit($meta['description'], 160, '');

        $listItems = collect($items)->take(20)->map(function ($item, $index) use ($kind) {
            $name = $item->name ?? $item->project_name ?? $item->title ?? 'Item';
            $slug = $item->slug ?? null;

            $path = match ($kind) {
                'services' => $slug ? "/services/{$slug}" : null,
                'portfolio' => $slug ? "/portfolio/{$slug}" : null,
                'blog' => $slug ? "/blog/{$slug}" : null,
                default => null,
            };

            return [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $name,
                'url' => $path ? url($path) : null,
            ];
        })->filter(fn ($item) => filled($item['url']))->values()->all();

        return self::compose(
            title: $title,
            description: $description,
            keywords: self::defaults($settings)['keywords'],
            canonical: $canonical,
            image: self::defaults($settings)['image'],
            type: 'website',
            robots: 'index, follow',
            settings: $settings,
            schema: array_filter([
                self::webPageSchema($meta['title'], $description, $canonical),
                self::breadcrumbSchema([
                    ['name' => 'Home', 'url' => url('/')],
                    ['name' => $meta['title'], 'url' => $canonical],
                ]),
                $listItems ? [
                    '@context' => 'https://schema.org',
                    '@type' => 'ItemList',
                    'name' => $meta['title'],
                    'itemListElement' => $listItems,
                ] : null,
                $kind === 'blog' ? [
                    '@context' => 'https://schema.org',
                    '@type' => 'Blog',
                    'name' => $meta['title'],
                    'url' => $canonical,
                    'publisher' => self::organizationRef($settings),
                ] : null,
                $kind === 'packages' ? self::packageOffersSchema($items, $settings) : null,
            ]),
        );
    }

    public static function forDetail(string $kind, Model $item, array $settings): array
    {
        $itemSeo = is_array($item->seo ?? null) ? $item->seo : [];
        $name = $item->name ?? $item->project_name ?? $item->title ?? 'Details';
        $excerpt = self::plainText($item->excerpt ?? $item->description ?? $item->content ?? '');

        $path = match ($kind) {
            'service' => "/services/{$item->slug}",
            'project' => "/portfolio/{$item->slug}",
            'post' => "/blog/{$item->slug}",
            'career' => "/careers/{$item->slug}",
            default => '/',
        };

        $canonical = $itemSeo['canonical'] ?? url($path);
        $image = self::mediaUrl(
            $itemSeo['og_image_media'] ?? $item->thumbnail_media ?? $item->banner_media ?? $item->image_media ?? null,
            $itemSeo['og_image'] ?? $item->thumbnail_path ?? $item->banner_path ?? $item->image_path ?? null,
        ) ?? self::defaults($settings)['image'];

        $title = $itemSeo['title'] ?? "{$name} | ".self::siteName($settings);
        $description = Str::limit($itemSeo['description'] ?? $excerpt ?: self::defaults($settings)['description'], 160, '');
        $keywords = $itemSeo['keywords'] ?? self::defaults($settings)['keywords'];

        $breadcrumbs = [
            ['name' => 'Home', 'url' => url('/')],
            ...match ($kind) {
                'service' => [
                    ['name' => 'Services', 'url' => url('/services')],
                    ['name' => $name, 'url' => $canonical],
                ],
                'project' => [
                    ['name' => 'Portfolio', 'url' => url('/portfolio')],
                    ['name' => $name, 'url' => $canonical],
                ],
                'post' => [
                    ['name' => 'Blog', 'url' => url('/blog')],
                    ['name' => $name, 'url' => $canonical],
                ],
                'career' => [
                    ['name' => 'Careers', 'url' => url('/careers')],
                    ['name' => $name, 'url' => $canonical],
                ],
                default => [['name' => $name, 'url' => $canonical]],
            },
        ];

        $schema = [
            self::webPageSchema($name, $description, $canonical),
            self::breadcrumbSchema($breadcrumbs),
        ];

        if ($kind === 'service') {
            $schema[] = [
                '@context' => 'https://schema.org',
                '@type' => 'Service',
                'name' => $name,
                'description' => $description,
                'url' => $canonical,
                'provider' => self::organizationRef($settings),
                'image' => $image,
            ];
        }

        if ($kind === 'project') {
            $schema[] = [
                '@context' => 'https://schema.org',
                '@type' => 'CreativeWork',
                'name' => $name,
                'description' => $description,
                'url' => $canonical,
                'image' => $image,
                'creator' => self::organizationRef($settings),
                'about' => $item->category ?? null,
            ];
        }

        if ($kind === 'post') {
            $schema[] = [
                '@context' => 'https://schema.org',
                '@type' => 'BlogPosting',
                'headline' => $name,
                'description' => $description,
                'url' => $canonical,
                'image' => $image ? [$image] : null,
                'datePublished' => optional($item->published_at)->toAtomString(),
                'dateModified' => optional($item->updated_at)->toAtomString(),
                'author' => self::organizationRef($settings),
                'publisher' => self::organizationRef($settings),
                'mainEntityOfPage' => $canonical,
                'articleSection' => $item->category?->name,
                'keywords' => is_array($item->tags ?? null) ? implode(', ', $item->tags) : null,
            ];
        }

        return self::compose(
            title: $title,
            description: $description,
            keywords: $keywords,
            canonical: $canonical,
            image: $image,
            type: $kind === 'post' ? 'article' : 'website',
            robots: self::robots($itemSeo),
            settings: $settings,
            schema: $schema,
            article: $kind === 'post' ? [
                'published_time' => optional($item->published_at)->toAtomString(),
                'modified_time' => optional($item->updated_at)->toAtomString(),
                'section' => $item->category?->name,
                'tag' => is_array($item->tags ?? null) ? $item->tags : [],
            ] : null,
        );
    }

    public static function forPage(?Model $page, string $fallbackTitle, array $settings, string $canonicalPath): array
    {
        $pageSeo = is_array($page?->seo) ? $page->seo : [];
        $name = $page?->name ?? $fallbackTitle;
        $body = self::plainText($page?->content ?? '');

        $canonical = $pageSeo['canonical'] ?? url($canonicalPath);
        $image = self::mediaUrl(
            $pageSeo['og_image_media'] ?? $page?->banner_media ?? null,
            $pageSeo['og_image'] ?? $page?->banner_path ?? null,
        ) ?? self::defaults($settings)['image'];

        $title = $pageSeo['title'] ?? "{$name} | ".self::siteName($settings);
        $description = Str::limit($pageSeo['description'] ?? $body ?: self::defaults($settings)['description'], 160, '');

        $breadcrumbs = [
            ['name' => 'Home', 'url' => url('/')],
            ['name' => $name, 'url' => $canonical],
        ];

        return self::compose(
            title: $title,
            description: $description,
            keywords: $pageSeo['keywords'] ?? self::defaults($settings)['keywords'],
            canonical: $canonical,
            image: $image,
            type: 'website',
            robots: self::robots($pageSeo),
            settings: $settings,
            schema: [
                self::webPageSchema($name, $description, $canonical),
                self::breadcrumbSchema($breadcrumbs),
                self::organizationSchema($settings),
            ],
        );
    }

    public static function forStatic(string $title, string $description, string $path): array
    {
        $settings = ['site' => \App\Models\SiteSetting::where('key', 'site')->first()?->value ?? []];
        $canonical = url($path);

        return self::compose(
            title: $title.' | '.self::siteName($settings),
            description: Str::limit($description, 160, ''),
            keywords: self::defaults($settings)['keywords'],
            canonical: $canonical,
            image: self::defaults($settings)['image'],
            type: 'website',
            robots: 'index, follow',
            settings: $settings,
            schema: [
                self::webPageSchema($title, $description, $canonical),
                self::breadcrumbSchema([
                    ['name' => 'Home', 'url' => url('/')],
                    ['name' => $title, 'url' => $canonical],
                ]),
            ],
        );
    }

    public static function forContact(array $settings): array
    {
        $contact = $settings['contact'] ?? [];
        $title = 'Contact Us | '.self::siteName($settings);
        $description = 'Get in touch with '.self::siteName($settings).' for software development, web apps, SaaS and digital product consulting.';
        $canonical = url('/contact');

        return self::compose(
            title: $title,
            description: $description,
            keywords: self::defaults($settings)['keywords'],
            canonical: $canonical,
            image: self::defaults($settings)['image'],
            type: 'website',
            robots: 'index, follow',
            settings: $settings,
            schema: [
                self::webPageSchema('Contact', $description, $canonical),
                self::breadcrumbSchema([
                    ['name' => 'Home', 'url' => url('/')],
                    ['name' => 'Contact', 'url' => $canonical],
                ]),
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'ContactPage',
                    'name' => 'Contact '.self::siteName($settings),
                    'url' => $canonical,
                    'description' => $description,
                ],
                self::localBusinessSchema($settings),
            ],
        );
    }

    private static function compose(
        string $title,
        string $description,
        ?string $keywords,
        string $canonical,
        ?string $image,
        string $type,
        string $robots,
        array $settings,
        array $schema,
        ?array $article = null,
    ): array {
        $siteName = self::siteName($settings);
        $locale = str_replace('_', '-', app()->getLocale());

        return [
            'title' => Str::limit(trim($title), 70, ''),
            'description' => Str::limit(trim(strip_tags($description)), 160, ''),
            'keywords' => $keywords,
            'canonical' => $canonical,
            'robots' => $robots,
            'locale' => $locale,
            'site_name' => $siteName,
            'og' => [
                'title' => Str::limit(trim($title), 70, ''),
                'description' => Str::limit(trim(strip_tags($description)), 200, ''),
                'image' => $image,
                'type' => $type,
                'url' => $canonical,
                'site_name' => $siteName,
                'locale' => $locale,
            ],
            'twitter' => [
                'card' => $image ? 'summary_large_image' : 'summary',
                'title' => Str::limit(trim($title), 70, ''),
                'description' => Str::limit(trim(strip_tags($description)), 200, ''),
                'image' => $image,
                'site' => self::twitterHandle($settings),
            ],
            'schema' => array_values(array_filter($schema)),
            'article' => $article,
        ];
    }

    private static function defaults(array $settings): array
    {
        $site = $settings['site'] ?? [];
        $seo = $settings['seo'] ?? [];

        return [
            'site_name' => self::siteName($settings),
            'tagline' => $site['tagline'] ?? 'Software Development Agency',
            'description' => $seo['description'] ?? 'Professional software development and digital agency services.',
            'keywords' => $seo['keywords'] ?? '',
            'image' => self::mediaUrl($seo['og_image_media'] ?? null, $seo['og_image'] ?? $site['logo'] ?? null),
        ];
    }

    private static function siteName(array $settings): string
    {
        return $settings['site']['name'] ?? config('app.name', 'AR Soft BD');
    }

    private static function robots(array $seo): string
    {
        return ! empty($seo['noindex']) ? 'noindex, nofollow' : 'index, follow';
    }

    private static function twitterHandle(array $settings): ?string
    {
        $twitter = $settings['social']['twitter'] ?? null;
        if (! filled($twitter) || $twitter === '#') {
            return null;
        }

        if (str_starts_with($twitter, '@')) {
            return $twitter;
        }

        if (preg_match('~twitter\.com/([^/?]+)~i', $twitter, $matches)) {
            return '@'.$matches[1];
        }

        return null;
    }

    private static function mediaUrl(?array $media, ?string $path, int $width = 1200): ?string
    {
        if (is_array($media)) {
            $url = $media['secure_url'] ?? $media['url'] ?? null;
            if ($url) {
                if (($media['disk'] ?? null) === 'cloudinary') {
                    return str_replace('/upload/', "/upload/f_auto,q_auto,c_limit,w_{$width}/", $url);
                }

                return self::absoluteUrl($url);
            }
        }

        if (filled($path)) {
            return self::absoluteUrl($path);
        }

        return null;
    }

    private static function absoluteUrl(string $url): string
    {
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        if (str_starts_with($url, '/storage/')) {
            return url($url);
        }

        return url('/'.ltrim($url, '/'));
    }

    private static function plainText(?string $value): string
    {
        if (! filled($value)) {
            return '';
        }

        $text = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim(preg_replace('/\s+/', ' ', $text) ?? '');
    }

    private static function organizationRef(array $settings): array
    {
        return [
            '@type' => 'Organization',
            'name' => self::siteName($settings),
            'url' => url('/'),
        ];
    }

    private static function organizationSchema(array $settings): array
    {
        $site = $settings['site'] ?? [];
        $social = $settings['social'] ?? [];
        $contact = $settings['contact'] ?? [];

        $sameAs = collect($social)
            ->filter(fn ($url) => filled($url) && $url !== '#')
            ->values()
            ->all();

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => self::siteName($settings),
            'url' => url('/'),
            'logo' => self::mediaUrl(null, $site['logo'] ?? null),
            'description' => $settings['seo']['description'] ?? $site['tagline'] ?? null,
            'sameAs' => $sameAs ?: null,
            'contactPoint' => filled($contact['email'] ?? null) ? [
                '@type' => 'ContactPoint',
                'contactType' => 'customer support',
                'email' => $contact['email'],
                'telephone' => $contact['phone'] ?? null,
                'areaServed' => 'Worldwide',
                'availableLanguage' => ['English'],
            ] : null,
        ]);
    }

    private static function websiteSchema(array $settings): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => self::siteName($settings),
            'url' => url('/'),
            'description' => $settings['seo']['description'] ?? null,
            'publisher' => self::organizationRef($settings),
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => url('/blog?q={search_term_string}'),
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    private static function webPageSchema(string $name, string $description, string $url): array
    {
        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'WebPage',
            'name' => $name,
            'description' => $description ?: null,
            'url' => $url,
            'isPartOf' => [
                '@type' => 'WebSite',
                'url' => url('/'),
            ],
        ]);
    }

    private static function breadcrumbSchema(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)->values()->map(fn ($item, $index) => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ])->all(),
        ];
    }

    private static function faqPageSchema(array $faqs): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => collect($faqs)->map(fn ($faq) => [
                '@type' => 'Question',
                'name' => $faq->question ?? $faq['question'] ?? '',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => self::plainText($faq->answer ?? $faq['answer'] ?? ''),
                ],
            ])->filter(fn ($item) => filled($item['name']))->values()->all(),
        ];
    }

    private static function packageOffersSchema(array $items, array $settings): ?array
    {
        $offers = collect($items)->map(fn ($item) => array_filter([
            '@type' => 'Offer',
            'name' => $item->name ?? null,
            'price' => $item->price ?? null,
            'url' => url('/contact'),
            'availability' => 'https://schema.org/InStock',
            'seller' => self::organizationRef($settings),
        ]))->values()->all();

        if (! $offers) {
            return null;
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'name' => 'Software Development Packages',
            'itemListElement' => $offers,
        ];
    }

    private static function localBusinessSchema(array $settings): array
    {
        $contact = $settings['contact'] ?? [];
        $site = $settings['site'] ?? [];

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            'name' => self::siteName($settings),
            'url' => url('/'),
            'image' => self::mediaUrl(null, $site['logo'] ?? null),
            'email' => $contact['email'] ?? null,
            'telephone' => $contact['phone'] ?? null,
            'address' => filled($contact['address'] ?? null) ? [
                '@type' => 'PostalAddress',
                'streetAddress' => $contact['address'],
            ] : null,
        ]);
    }
}
