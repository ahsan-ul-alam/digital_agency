<?php

namespace App\Support;

class AdminNavigation
{
    public static function groups(): array
    {
        return [
            [
                'key' => 'dashboard',
                'title' => 'Dashboard',
                'icon' => 'dashboard',
                'href' => '/admin',
                'description' => 'Overview, analytics, quick actions and recent activity.',
            ],
            [
                'key' => 'website',
                'title' => 'Website Management',
                'icon' => 'website',
                'children' => [
                    ['key' => 'homepage', 'title' => 'Homepage Sections', 'href' => '/admin/homepage', 'description' => 'Hero, about, process and bottom CTA content.'],
                    ['key' => 'pages', 'title' => 'Pages', 'href' => '/admin/pages', 'description' => 'Create pages and design them in AR Builder.'],
                    ['key' => 'menus', 'title' => 'Menus & Navigation', 'href' => '/admin/menus', 'description' => 'Header navigation, footer columns and CTA button.'],
                    ['key' => 'logos', 'title' => 'Trusted Logos', 'href' => '/admin/logos', 'description' => 'Client logos shown below the hero.'],
                    ['key' => 'statistics', 'title' => 'Hero Statistics', 'href' => '/admin/statistics', 'description' => 'Counter stats displayed in the hero area.'],
                    ['key' => 'theme', 'title' => 'Theme & Colors', 'href' => '/admin/theme/settings', 'description' => 'Brand colors, gradients and visual identity.'],
                ],
            ],
            [
                'key' => 'content',
                'title' => 'Content Management',
                'icon' => 'content',
                'children' => [
                    ['key' => 'blog', 'title' => 'Blog Posts', 'href' => '/admin/blog', 'description' => 'Publish and manage blog articles.'],
                    ['key' => 'categories', 'title' => 'Categories', 'href' => '/admin/categories', 'description' => 'Organize blog posts by category.'],
                    ['key' => 'testimonials', 'title' => 'Testimonials', 'href' => '/admin/testimonials', 'description' => 'Client reviews and ratings.'],
                    ['key' => 'faqs', 'title' => 'FAQs', 'href' => '/admin/faqs', 'description' => 'Frequently asked questions on the homepage.'],
                    ['key' => 'team', 'title' => 'Team Members', 'href' => '/admin/team', 'description' => 'Team member profiles and photos.'],
                ],
            ],
            [
                'key' => 'services',
                'title' => 'Services & Packages',
                'icon' => 'services',
                'children' => [
                    ['key' => 'services', 'title' => 'Services', 'href' => '/admin/services', 'description' => 'Service offerings on the homepage and services page.'],
                    ['key' => 'packages', 'title' => 'Packages & Pricing', 'href' => '/admin/packages', 'description' => 'Pricing tiers and plan features.'],
                ],
            ],
            [
                'key' => 'portfolio',
                'title' => 'Portfolio',
                'icon' => 'portfolio',
                'children' => [
                    ['key' => 'portfolio', 'title' => 'Projects', 'href' => '/admin/portfolio', 'description' => 'Case studies and featured project work.'],
                ],
            ],
            [
                'key' => 'media',
                'title' => 'Media Center',
                'icon' => 'media',
                'children' => [
                    ['key' => 'media', 'title' => 'Media Library', 'href' => '/admin/media', 'description' => 'Uploaded images and videos.'],
                    ['key' => 'cloudinary', 'title' => 'Cloudinary', 'href' => '/admin/cloudinary/settings', 'description' => 'Connect Cloudinary for image and video uploads.'],
                ],
            ],
            [
                'key' => 'marketing',
                'title' => 'Marketing',
                'icon' => 'marketing',
                'children' => [
                    ['key' => 'contacts', 'title' => 'Leads & Inquiries', 'href' => '/admin/contacts', 'description' => 'Hero form and contact page submissions.'],
                    ['key' => 'forms', 'title' => 'Form Builder', 'href' => '/admin/forms', 'description' => 'Build forms with shortcodes for AR Builder.'],
                ],
            ],
            [
                'key' => 'seo',
                'title' => 'SEO Management',
                'icon' => 'seo',
                'children' => [
                    ['key' => 'site-seo', 'title' => 'Meta & SEO Settings', 'href' => '/admin/site/settings', 'description' => 'Default meta title, description and keywords.'],
                ],
            ],
            [
                'key' => 'system',
                'title' => 'System Settings',
                'icon' => 'system',
                'children' => [
                    ['key' => 'site', 'title' => 'Company Information', 'href' => '/admin/site/settings', 'description' => 'Site name, logo, contact details and social links.'],
                    ['key' => 'cloudinary-settings', 'title' => 'API & Cloudinary', 'href' => '/admin/cloudinary/settings', 'description' => 'Cloudinary credentials and upload configuration.'],
                ],
            ],
        ];
    }

    public static function flatItems(): array
    {
        return collect(self::groups())->flatMap(function (array $group) {
            if (isset($group['href'])) {
                return [[
                    ...$group,
                    'group' => 'Overview',
                    'groupKey' => $group['key'],
                ]];
            }

            return collect($group['children'] ?? [])->map(fn (array $item) => [
                ...$item,
                'group' => $group['title'],
                'groupKey' => $group['key'],
            ]);
        })->values()->all();
    }

    public static function flat(): array
    {
        return collect(self::flatItems())
            ->reject(fn ($item) => in_array($item['key'], ['dashboard', 'site', 'site-seo', 'menus', 'theme', 'cloudinary', 'cloudinary-settings'], true))
            ->values()
            ->all();
    }

    public static function find(string $key): ?array
    {
        foreach (self::flatItems() as $item) {
            if ($item['key'] === $key) {
                return $item;
            }
        }

        return null;
    }
}
