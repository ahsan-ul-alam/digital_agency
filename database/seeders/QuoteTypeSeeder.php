<?php

namespace Database\Seeders;

use App\Models\QuoteType;
use Illuminate\Database\Seeder;

class QuoteTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'slug' => 'corporate-website',
                'name' => 'Corporate Website',
                'description' => 'Business website with CMS, SEO and lead capture.',
                'base_price' => 85000,
                'sort_order' => 1,
                'options' => [
                    ['key' => 'pages', 'label' => 'Extra pages', 'type' => 'number', 'unit_price' => 8000, 'min' => 0, 'max' => 30, 'default' => 3],
                    ['key' => 'cms', 'label' => 'Advanced CMS modules', 'type' => 'toggle', 'price' => 35000],
                    ['key' => 'multilingual', 'label' => 'Multilingual (2 languages)', 'type' => 'toggle', 'price' => 45000],
                ],
            ],
            [
                'slug' => 'ecommerce',
                'name' => 'E-commerce Store',
                'description' => 'Online store with catalog, checkout and admin.',
                'base_price' => 180000,
                'sort_order' => 2,
                'options' => [
                    ['key' => 'products', 'label' => 'Product slots (per 50)', 'type' => 'number', 'unit_price' => 12000, 'min' => 0, 'max' => 20, 'default' => 2],
                    ['key' => 'payments', 'label' => 'Payment gateway integration', 'type' => 'toggle', 'price' => 25000],
                    ['key' => 'inventory', 'label' => 'Inventory management', 'type' => 'toggle', 'price' => 30000],
                ],
            ],
            [
                'slug' => 'erp',
                'name' => 'ERP System',
                'description' => 'Inventory, accounting, HR and operations modules.',
                'base_price' => 450000,
                'sort_order' => 3,
                'options' => [
                    ['key' => 'users', 'label' => 'User seats (per 10)', 'type' => 'number', 'unit_price' => 40000, 'min' => 1, 'max' => 50, 'default' => 2],
                    ['key' => 'accounting', 'label' => 'Accounting module', 'type' => 'toggle', 'price' => 120000],
                    ['key' => 'reports', 'label' => 'Advanced reporting', 'type' => 'toggle', 'price' => 80000],
                ],
            ],
            [
                'slug' => 'lms',
                'name' => 'LMS Platform',
                'description' => 'Learning management with courses, quizzes and certificates.',
                'base_price' => 320000,
                'sort_order' => 4,
                'options' => [
                    ['key' => 'courses', 'label' => 'Course bundles (per 10)', 'type' => 'number', 'unit_price' => 25000, 'min' => 0, 'max' => 20, 'default' => 2],
                    ['key' => 'live', 'label' => 'Live class integration', 'type' => 'toggle', 'price' => 55000],
                    ['key' => 'certificates', 'label' => 'Certificate engine', 'type' => 'toggle', 'price' => 35000],
                ],
            ],
            [
                'slug' => 'crm',
                'name' => 'CRM Platform',
                'description' => 'Lead pipeline, proposals, invoicing and client portal.',
                'base_price' => 280000,
                'sort_order' => 5,
                'options' => [
                    ['key' => 'seats', 'label' => 'Sales seats (per 5)', 'type' => 'number', 'unit_price' => 30000, 'min' => 1, 'max' => 20, 'default' => 2],
                    ['key' => 'automation', 'label' => 'Email automation', 'type' => 'toggle', 'price' => 45000],
                    ['key' => 'portal', 'label' => 'Client portal', 'type' => 'toggle', 'price' => 75000],
                ],
            ],
        ];

        foreach ($types as $type) {
            QuoteType::updateOrCreate(['slug' => $type['slug']], $type);
        }
    }
}
