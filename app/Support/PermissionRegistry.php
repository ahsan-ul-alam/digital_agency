<?php

namespace App\Support;

class PermissionRegistry
{
    public static function definitions(): array
    {
        return [
            ['slug' => 'dashboard.view', 'name' => 'View Dashboard', 'group' => 'Overview', 'description' => 'Access the admin dashboard.'],
            ['slug' => 'homepage.manage', 'name' => 'Manage Homepage', 'group' => 'Website', 'description' => 'Edit homepage sections.'],
            ['slug' => 'pages.manage', 'name' => 'Manage Pages', 'group' => 'Website', 'description' => 'Create and edit CMS pages and AR Builder.'],
            ['slug' => 'menus.manage', 'name' => 'Manage Menus', 'group' => 'Website', 'description' => 'Edit header and footer navigation.'],
            ['slug' => 'theme.manage', 'name' => 'Manage Theme', 'group' => 'Website', 'description' => 'Update brand colors and theme.'],
            ['slug' => 'logos.manage', 'name' => 'Manage Logos', 'group' => 'Website', 'description' => 'Manage trusted client logos.'],
            ['slug' => 'statistics.manage', 'name' => 'Manage Statistics', 'group' => 'Website', 'description' => 'Edit hero counter statistics.'],
            ['slug' => 'blog.manage', 'name' => 'Manage Blog', 'group' => 'Content', 'description' => 'Publish and edit blog posts.'],
            ['slug' => 'categories.manage', 'name' => 'Manage Categories', 'group' => 'Content', 'description' => 'Manage blog categories.'],
            ['slug' => 'testimonials.manage', 'name' => 'Manage Testimonials', 'group' => 'Content', 'description' => 'Manage client testimonials.'],
            ['slug' => 'faqs.manage', 'name' => 'Manage FAQs', 'group' => 'Content', 'description' => 'Manage FAQ entries.'],
            ['slug' => 'team.manage', 'name' => 'Manage Team', 'group' => 'Content', 'description' => 'Manage team member profiles.'],
            ['slug' => 'services.manage', 'name' => 'Manage Services', 'group' => 'Business', 'description' => 'Manage service offerings.'],
            ['slug' => 'packages.manage', 'name' => 'Manage Packages', 'group' => 'Business', 'description' => 'Manage pricing packages.'],
            ['slug' => 'portfolio.manage', 'name' => 'Manage Portfolio', 'group' => 'Business', 'description' => 'Manage portfolio projects.'],
            ['slug' => 'media.manage', 'name' => 'Manage Media', 'group' => 'Media', 'description' => 'Upload and manage media library.'],
            ['slug' => 'leads.view', 'name' => 'View CRM Leads', 'group' => 'Marketing', 'description' => 'View and manage the lead pipeline.'],
            ['slug' => 'leads.manage', 'name' => 'Manage CRM Leads', 'group' => 'Marketing', 'description' => 'Update lead status, notes, and follow-ups.'],
            ['slug' => 'quotes.manage', 'name' => 'Manage Quote Calculator', 'group' => 'Sales', 'description' => 'Configure public quote calculator pricing.'],
            ['slug' => 'proposals.manage', 'name' => 'Manage Proposals', 'group' => 'Sales', 'description' => 'Create and send client proposals.'],
            ['slug' => 'invoices.manage', 'name' => 'Manage Invoices', 'group' => 'Sales', 'description' => 'Create invoices and track payments.'],
            ['slug' => 'bookings.view', 'name' => 'View Meeting Bookings', 'group' => 'Sales', 'description' => 'View and manage scheduled client meetings.'],
            ['slug' => 'bookings.manage', 'name' => 'Manage Meeting Bookings', 'group' => 'Sales', 'description' => 'Confirm, cancel and configure meeting booking.'],
            ['slug' => 'careers.manage', 'name' => 'Manage Careers', 'group' => 'Content', 'description' => 'Publish job openings and hiring pages.'],
            ['slug' => 'audit.view', 'name' => 'View Audit Log', 'group' => 'Settings', 'description' => 'Review admin activity and system changes.'],
            ['slug' => 'contacts.view', 'name' => 'View Leads (Legacy)', 'group' => 'Marketing', 'description' => 'Legacy permission mapped to CRM leads.'],
            ['slug' => 'forms.manage', 'name' => 'Manage Forms', 'group' => 'Marketing', 'description' => 'Build and manage forms.'],
            ['slug' => 'site.settings', 'name' => 'Site Settings', 'group' => 'Settings', 'description' => 'Edit company info and SEO defaults.'],
            ['slug' => 'cloudinary.manage', 'name' => 'Manage Cloudinary', 'group' => 'Settings', 'description' => 'Configure Cloudinary integration.'],
            ['slug' => 'users.manage', 'name' => 'Manage Users', 'group' => 'Access Control', 'description' => 'Create and manage admin users.'],
            ['slug' => 'roles.manage', 'name' => 'Manage Roles', 'group' => 'Access Control', 'description' => 'Create roles and assign permissions.'],
        ];
    }

    public static function navKeyMap(): array
    {
        return [
            'dashboard' => 'dashboard.view',
            'homepage' => 'homepage.manage',
            'pages' => 'pages.manage',
            'menus' => 'menus.manage',
            'theme' => 'theme.manage',
            'logos' => 'logos.manage',
            'statistics' => 'statistics.manage',
            'blog' => 'blog.manage',
            'categories' => 'categories.manage',
            'testimonials' => 'testimonials.manage',
            'faqs' => 'faqs.manage',
            'team' => 'team.manage',
            'services' => 'services.manage',
            'packages' => 'packages.manage',
            'portfolio' => 'portfolio.manage',
            'media' => 'media.manage',
            'contacts' => 'leads.view',
            'leads' => 'leads.view',
            'quotes' => 'quotes.manage',
            'proposals' => 'proposals.manage',
            'invoices' => 'invoices.manage',
            'bookings' => 'bookings.view',
            'booking-settings' => 'bookings.manage',
            'payment-settings' => 'invoices.manage',
            'careers' => 'careers.manage',
            'audit-logs' => 'audit.view',
            'forms' => 'forms.manage',
            'site' => 'site.settings',
            'cloudinary' => 'cloudinary.manage',
            'users' => 'users.manage',
            'roles' => 'roles.manage',
        ];
    }

    public static function moduleMap(): array
    {
        return [
            'homepage' => 'homepage.manage',
            'logos' => 'logos.manage',
            'services' => 'services.manage',
            'statistics' => 'statistics.manage',
            'portfolio' => 'portfolio.manage',
            'packages' => 'packages.manage',
            'testimonials' => 'testimonials.manage',
            'team' => 'team.manage',
            'faqs' => 'faqs.manage',
            'categories' => 'categories.manage',
            'blog' => 'blog.manage',
            'pages' => 'pages.manage',
            'contacts' => 'leads.view',
            'leads' => 'leads.view',
            'quotes' => 'quotes.manage',
            'proposals' => 'proposals.manage',
            'invoices' => 'invoices.manage',
            'bookings' => 'bookings.view',
            'booking-settings' => 'bookings.manage',
            'payment-settings' => 'invoices.manage',
            'careers' => 'careers.manage',
            'audit-logs' => 'audit.view',
        ];
    }

    public static function resolvePath(string $path): ?string
    {
        $path = '/'.trim($path, '/');

        if ($path === '/admin' || $path === '/admin/') {
            return 'dashboard.view';
        }

        $map = [
            '/admin/homepage' => 'homepage.manage',
            '/admin/pages' => 'pages.manage',
            '/admin/menus' => 'menus.manage',
            '/admin/theme/settings' => 'theme.manage',
            '/admin/logos' => 'logos.manage',
            '/admin/statistics' => 'statistics.manage',
            '/admin/blog' => 'blog.manage',
            '/admin/categories' => 'categories.manage',
            '/admin/testimonials' => 'testimonials.manage',
            '/admin/faqs' => 'faqs.manage',
            '/admin/team' => 'team.manage',
            '/admin/services' => 'services.manage',
            '/admin/packages' => 'packages.manage',
            '/admin/portfolio' => 'portfolio.manage',
            '/admin/media' => 'media.manage',
            '/admin/contacts' => 'leads.view',
            '/admin/leads' => 'leads.view',
            '/admin/notifications' => 'leads.view',
            '/admin/quotes' => 'quotes.manage',
            '/admin/proposals' => 'proposals.manage',
            '/admin/invoices' => 'invoices.manage',
            '/admin/bookings/settings' => 'bookings.manage',
            '/admin/payments/settings' => 'invoices.manage',
            '/admin/bookings' => 'bookings.view',
            '/admin/careers' => 'careers.manage',
            '/admin/audit-logs' => 'audit.view',
            '/admin/forms' => 'forms.manage',
            '/admin/form-submissions' => 'forms.manage',
            '/admin/site/settings' => 'site.settings',
            '/admin/cloudinary/settings' => 'cloudinary.manage',
            '/admin/users' => 'users.manage',
            '/admin/roles' => 'roles.manage',
        ];

        foreach ($map as $prefix => $permission) {
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                return $permission;
            }
        }

        if (preg_match('#^/admin/([^/]+)#', $path, $matches)) {
            return self::moduleMap()[$matches[1]] ?? null;
        }

        return null;
    }
}
