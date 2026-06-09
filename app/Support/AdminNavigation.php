<?php

namespace App\Support;

use App\Models\User;

class AdminNavigation
{
    public static function groups(): array
    {
        return self::groupsFor(null);
    }

    public static function groupsFor(?User $user): array
    {
        $groups = [
            [
                'key' => 'dashboard',
                'title' => 'Dashboard',
                'icon' => 'dashboard',
                'href' => '/admin',
                'permission' => 'dashboard.view',
                'description' => 'Overview, analytics, and quick actions.',
            ],
            [
                'key' => 'website',
                'title' => 'Website',
                'icon' => 'website',
                'zone' => 'Build',
                'children' => [
                    ['key' => 'homepage', 'title' => 'Homepage Sections', 'href' => '/admin/homepage', 'permission' => 'homepage.manage', 'description' => 'Hero, about, process and bottom CTA content.'],
                    ['key' => 'pages', 'title' => 'Pages', 'href' => '/admin/pages', 'permission' => 'pages.manage', 'description' => 'Create pages and design them in AR Builder.'],
                    ['key' => 'menus', 'title' => 'Menus & Navigation', 'href' => '/admin/menus', 'permission' => 'menus.manage', 'description' => 'Header navigation, footer columns and CTA button.'],
                    ['key' => 'theme', 'title' => 'Theme & Colors', 'href' => '/admin/theme/settings', 'permission' => 'theme.manage', 'description' => 'Brand colors, gradients and visual identity.'],
                    ['key' => 'logos', 'title' => 'Trusted Logos', 'href' => '/admin/logos', 'permission' => 'logos.manage', 'description' => 'Client logos shown below the hero.'],
                    ['key' => 'statistics', 'title' => 'Hero Statistics', 'href' => '/admin/statistics', 'permission' => 'statistics.manage', 'description' => 'Counter stats displayed in the hero area.'],
                ],
            ],
            [
                'key' => 'content',
                'title' => 'Content',
                'icon' => 'content',
                'zone' => 'Build',
                'children' => [
                    ['key' => 'blog', 'title' => 'Blog Posts', 'href' => '/admin/blog', 'permission' => 'blog.manage', 'description' => 'Publish and manage blog articles.'],
                    ['key' => 'categories', 'title' => 'Categories', 'href' => '/admin/categories', 'permission' => 'categories.manage', 'description' => 'Organize blog posts by category.'],
                    ['key' => 'testimonials', 'title' => 'Testimonials', 'href' => '/admin/testimonials', 'permission' => 'testimonials.manage', 'description' => 'Client reviews and ratings.'],
                    ['key' => 'faqs', 'title' => 'FAQs', 'href' => '/admin/faqs', 'permission' => 'faqs.manage', 'description' => 'Frequently asked questions on the homepage.'],
                    ['key' => 'team', 'title' => 'Team Members', 'href' => '/admin/team', 'permission' => 'team.manage', 'description' => 'Team member profiles and photos.'],
                    ['key' => 'careers', 'title' => 'Careers', 'href' => '/admin/careers', 'permission' => 'careers.manage', 'description' => 'Open roles and hiring content for the careers page.'],
                ],
            ],
            [
                'key' => 'business',
                'title' => 'Business',
                'icon' => 'business',
                'zone' => 'Build',
                'children' => [
                    ['key' => 'services', 'title' => 'Services', 'href' => '/admin/services', 'permission' => 'services.manage', 'description' => 'Service offerings on the homepage and services page.'],
                    ['key' => 'packages', 'title' => 'Packages & Pricing', 'href' => '/admin/packages', 'permission' => 'packages.manage', 'description' => 'Pricing tiers and plan features.'],
                    ['key' => 'portfolio', 'title' => 'Portfolio', 'href' => '/admin/portfolio', 'permission' => 'portfolio.manage', 'description' => 'Case studies and featured project work.'],
                ],
            ],
            [
                'key' => 'media',
                'title' => 'Media Library',
                'icon' => 'media',
                'zone' => 'Engage',
                'href' => '/admin/media',
                'permission' => 'media.manage',
                'description' => 'Uploaded images and videos from Cloudinary or local storage.',
            ],
            [
                'key' => 'marketing',
                'title' => 'Marketing',
                'icon' => 'marketing',
                'zone' => 'Engage',
                'children' => [
                    ['key' => 'leads', 'title' => 'CRM Leads', 'href' => '/admin/leads', 'permission' => 'leads.view', 'description' => 'Pipeline, notes, follow-ups and unified lead inbox.'],
                    ['key' => 'forms', 'title' => 'Form Builder', 'href' => '/admin/forms', 'permission' => 'forms.manage', 'description' => 'Build forms with shortcodes for AR Builder.'],
                ],
            ],
            [
                'key' => 'sales',
                'title' => 'Sales',
                'icon' => 'sales',
                'zone' => 'Engage',
                'children' => [
                    ['key' => 'quotes', 'title' => 'Quote Calculator', 'href' => '/admin/quotes', 'permission' => 'quotes.manage', 'description' => 'Configure project types and pricing for the public calculator.'],
                    ['key' => 'proposals', 'title' => 'Proposals', 'href' => '/admin/proposals', 'permission' => 'proposals.manage', 'description' => 'Create proposals, export PDF and email clients.'],
                    ['key' => 'invoices', 'title' => 'Invoices', 'href' => '/admin/invoices', 'permission' => 'invoices.manage', 'description' => 'Bill clients and track payment status.'],
                    ['key' => 'bookings', 'title' => 'Meeting Bookings', 'href' => '/admin/bookings', 'permission' => 'bookings.view', 'description' => 'Review and confirm scheduled discovery calls.'],
                ],
            ],
            [
                'key' => 'settings',
                'title' => 'Settings',
                'icon' => 'system',
                'zone' => 'Configure',
                'children' => [
                    ['key' => 'site', 'title' => 'Company & SEO', 'href' => '/admin/site/settings', 'permission' => 'site.settings', 'description' => 'Site identity, contact details, social links and default meta tags.'],
                    ['key' => 'cloudinary', 'title' => 'Cloudinary', 'href' => '/admin/cloudinary/settings', 'permission' => 'cloudinary.manage', 'description' => 'Cloudinary credentials and upload configuration.'],
                    ['key' => 'booking-settings', 'title' => 'Meeting Booking', 'href' => '/admin/bookings/settings', 'permission' => 'bookings.manage', 'description' => 'Availability windows, slot duration and timezone.'],
                    ['key' => 'payment-settings', 'title' => 'Payment Gateways', 'href' => '/admin/payments/settings', 'permission' => 'invoices.manage', 'description' => 'bKash, EPS, and bank transfer settings for client portal invoices.'],
                    ['key' => 'audit-logs', 'title' => 'Audit Log', 'href' => '/admin/audit-logs', 'permission' => 'audit.view', 'description' => 'Track admin actions across CRM, sales and settings.'],
                ],
            ],
            [
                'key' => 'access',
                'title' => 'Access Control',
                'icon' => 'access',
                'zone' => 'Configure',
                'children' => [
                    ['key' => 'users', 'title' => 'Users', 'href' => '/admin/users', 'permission' => 'users.manage', 'description' => 'Create admin users and assign roles.'],
                    ['key' => 'roles', 'title' => 'Roles & Permissions', 'href' => '/admin/roles', 'permission' => 'roles.manage', 'description' => 'Create roles and control module access.'],
                ],
            ],
        ];

        return collect($groups)
            ->map(function (array $group) use ($user) {
                if (isset($group['href'])) {
                    return self::canSee($user, $group['permission'] ?? null) ? $group : null;
                }

                $children = collect($group['children'] ?? [])
                    ->filter(fn (array $item) => self::canSee($user, $item['permission'] ?? null))
                    ->values()
                    ->all();

                if (! $children) {
                    return null;
                }

                return [...$group, 'children' => $children];
            })
            ->filter()
            ->values()
            ->all();
    }

    public static function flatItems(): array
    {
        return collect(self::groups())->flatMap(function (array $group) {
            if (isset($group['href'])) {
                return [[
                    ...$group,
                    'group' => $group['title'],
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
            ->reject(fn ($item) => in_array($item['key'], ['dashboard', 'site', 'menus', 'theme', 'cloudinary', 'users', 'roles'], true))
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

    private static function canSee(?User $user, ?string $permission): bool
    {
        if (! $permission) {
            return true;
        }

        if (! $user) {
            return true;
        }

        return $user->hasPermission($permission);
    }
}
