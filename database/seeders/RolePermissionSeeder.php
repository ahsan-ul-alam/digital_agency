<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\PermissionRegistry;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (PermissionRegistry::definitions() as $definition) {
            Permission::updateOrCreate(
                ['slug' => $definition['slug']],
                [
                    'name' => $definition['name'],
                    'group' => $definition['group'],
                    'description' => $definition['description'] ?? null,
                ]
            );
        }

        $superAdmin = Role::updateOrCreate(
            ['slug' => 'super-admin'],
            [
                'name' => 'Super Admin',
                'description' => 'Full access to every admin feature.',
                'is_system' => true,
            ]
        );

        $superAdmin->permissions()->sync(Permission::pluck('id'));

        $editor = Role::updateOrCreate(
            ['slug' => 'editor'],
            [
                'name' => 'Content Editor',
                'description' => 'Manage website content without system settings.',
                'is_system' => true,
            ]
        );

        $editor->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'homepage.manage',
                'pages.manage',
                'blog.manage',
                'categories.manage',
                'testimonials.manage',
                'faqs.manage',
                'team.manage',
                'services.manage',
                'packages.manage',
                'portfolio.manage',
                'media.manage',
                'leads.view',
                'leads.manage',
                'quotes.manage',
                'proposals.manage',
                'invoices.manage',
                'bookings.view',
                'bookings.manage',
                'careers.manage',
                'audit.view',
            ])->pluck('id')
        );

        User::where('email', 'admin@arsoftbd.com')->update(['role_id' => $superAdmin->id]);
    }
}
