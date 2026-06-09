<?php

namespace App\Support;

class PageTemplates
{
    public static function all(): array
    {
        return [
            [
                'key' => 'blank',
                'name' => 'Blank Page',
                'description' => 'Start from scratch with an empty canvas.',
                'sections' => [],
            ],
            [
                'key' => 'landing',
                'name' => 'Landing Page',
                'description' => 'Hero, features, stats and CTA for campaigns.',
                'sections' => [
                    self::section('hero', ['eyebrow' => 'AR Soft BD', 'title' => 'Build your next digital product with confidence', 'body' => '<p>Premium websites, SaaS platforms, and business tools tailored for ambitious teams.</p>', 'styles' => ['padding' => 'xl', 'background' => 'gradient', 'textAlign' => 'center']]),
                    self::section('features', ['title' => 'Why teams choose us', 'items' => [['title' => 'Strategy first', 'body' => 'Clear scope, milestones, and delivery plans.'], ['title' => 'Modern stack', 'body' => 'Laravel, React, and scalable cloud architecture.'], ['title' => 'Ongoing support', 'body' => 'Maintenance, analytics, and growth iterations.']], 'styles' => ['padding' => 'lg', 'columns' => '3']]),
                    self::section('counter', ['title' => 'Results that matter', 'items' => [['value' => '120', 'suffix' => '+', 'label' => 'Projects delivered'], ['value' => '98', 'suffix' => '%', 'label' => 'Client satisfaction']], 'styles' => ['padding' => 'lg', 'columns' => '2']]),
                    self::section('cta', ['title' => 'Ready to start your project?', 'body' => '<p>Book a discovery call or request a tailored proposal.</p>', 'button' => 'Get started', 'url' => '/contact', 'styles' => ['padding' => 'lg', 'background' => 'primary', 'textAlign' => 'center']]),
                ],
            ],
            [
                'key' => 'about',
                'name' => 'About Page',
                'description' => 'Company story, values and team highlights.',
                'sections' => [
                    self::section('hero', ['eyebrow' => 'About us', 'title' => 'We help brands ship premium digital experiences', 'body' => '<p>AR Soft BD is a product-minded agency focused on software, ecommerce, and growth platforms.</p>', 'styles' => ['padding' => 'lg', 'textAlign' => 'center']]),
                    self::section('content', ['title' => 'Our mission', 'body' => '<p>We combine design, engineering, and business operations into one cohesive delivery partner.</p>', 'styles' => ['padding' => 'md', 'maxWidth' => 'narrow']]),
                    self::section('features', ['title' => 'What we value', 'items' => [['title' => 'Craft', 'body' => 'Every interface and workflow should feel premium.'], ['title' => 'Clarity', 'body' => 'Transparent communication from proposal to launch.'], ['title' => 'Momentum', 'body' => 'Ship fast, iterate with data, and scale responsibly.']], 'styles' => ['padding' => 'lg', 'columns' => '3']]),
                ],
            ],
            [
                'key' => 'contact',
                'name' => 'Contact Page',
                'description' => 'Intro, embedded form and map.',
                'sections' => [
                    self::section('hero', ['eyebrow' => 'Contact', 'title' => 'Tell us about your project', 'body' => '<p>Share your goals and we will respond within one business day.</p>', 'styles' => ['padding' => 'lg', 'textAlign' => 'center']]),
                    self::section('form', ['title' => 'Send a message', 'description' => '<p>Use the form below and our team will follow up shortly.</p>', 'shortcode' => '', 'styles' => ['padding' => 'md', 'maxWidth' => 'narrow']]),
                    self::section('map', ['title' => 'Visit us', 'embed_url' => 'https://maps.google.com/maps?q=Dhaka&output=embed', 'height' => '360', 'styles' => ['padding' => 'md']]),
                ],
            ],
            [
                'key' => 'services',
                'name' => 'Services Page',
                'description' => 'Service overview with FAQ and CTA.',
                'sections' => [
                    self::section('hero', ['eyebrow' => 'Services', 'title' => 'End-to-end digital delivery', 'body' => '<p>From marketing sites to CRM platforms and client portals.</p>', 'styles' => ['padding' => 'lg', 'textAlign' => 'center']]),
                    self::section('features', ['title' => 'Core offerings', 'items' => [['title' => 'Web & CMS', 'body' => 'Dynamic pages, AR Builder, SEO and content ops.'], ['title' => 'Business platforms', 'body' => 'CRM, proposals, invoicing and client portals.'], ['title' => 'Growth systems', 'body' => 'Analytics, booking flows and automation.']], 'styles' => ['padding' => 'lg', 'columns' => '3']]),
                    self::section('faq', ['title' => 'Common questions', 'items' => [['question' => 'How do projects start?', 'answer' => '<p>We begin with discovery, scope, and a proposal with milestones.</p>'], ['question' => 'What is a typical timeline?', 'answer' => '<p>Marketing sites take 4–8 weeks; platforms vary by complexity.</p>']], 'styles' => ['padding' => 'lg', 'maxWidth' => 'narrow']]),
                    self::section('cta', ['title' => 'Need a custom scope?', 'body' => '<p>Use our quote calculator or book a call.</p>', 'button' => 'Request a quote', 'url' => '/quote', 'styles' => ['padding' => 'lg', 'background' => 'glass', 'textAlign' => 'center']]),
                ],
            ],
        ];
    }

    public static function find(string $key): ?array
    {
        return collect(self::all())->firstWhere('key', $key);
    }

    private static function section(string $type, array $data): array
    {
        return [
            'id' => $type.'-'.uniqid(),
            'type' => $type,
            ...$data,
        ];
    }
}
