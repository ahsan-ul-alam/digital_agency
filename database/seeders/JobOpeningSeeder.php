<?php

namespace Database\Seeders;

use App\Models\JobOpening;
use Illuminate\Database\Seeder;

class JobOpeningSeeder extends Seeder
{
    public function run(): void
    {
        $openings = [
            [
                'slug' => 'senior-laravel-developer',
                'title' => 'Senior Laravel Developer',
                'department' => 'Engineering',
                'location' => 'Dhaka / Remote',
                'employment_type' => 'full-time',
                'excerpt' => 'Build scalable Laravel platforms for agency and SaaS clients.',
                'description' => '<p>We are looking for a senior Laravel developer to lead backend delivery across CMS, CRM, and client portal products.</p><p>You will work with React, Inertia, Tailwind, and modern DevOps practices in a small, high-trust team.</p>',
                'requirements' => ['5+ years PHP/Laravel', 'React or Vue experience', 'Strong API design skills', 'Comfortable with client communication'],
                'sort_order' => 1,
            ],
            [
                'slug' => 'frontend-react-engineer',
                'title' => 'Frontend React Engineer',
                'department' => 'Engineering',
                'location' => 'Dhaka',
                'employment_type' => 'full-time',
                'excerpt' => 'Craft premium marketing sites and admin experiences with React and Tailwind.',
                'description' => '<p>Join AR Soft BD to ship polished public websites and SaaS-grade admin interfaces.</p><p>You will collaborate closely with designers and backend engineers on AR Builder and client-facing products.</p>',
                'requirements' => ['3+ years React', 'Tailwind CSS proficiency', 'Accessibility and performance mindset', 'Experience with component systems'],
                'sort_order' => 2,
            ],
            [
                'slug' => 'digital-project-manager',
                'title' => 'Digital Project Manager',
                'department' => 'Operations',
                'location' => 'Dhaka',
                'employment_type' => 'full-time',
                'excerpt' => 'Coordinate delivery across design, engineering, and client success.',
                'description' => '<p>Own timelines, proposals, and client communication for software and website projects.</p><p>You will work inside our CRM and project workflows to keep delivery predictable and premium.</p>',
                'requirements' => ['Agency or software delivery background', 'Excellent written communication', 'Comfort with proposals and scope control', 'Client-facing confidence'],
                'sort_order' => 3,
            ],
        ];

        foreach ($openings as $opening) {
            JobOpening::updateOrCreate(['slug' => $opening['slug']], $opening);
        }
    }
}
