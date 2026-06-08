<?php

namespace App\Support;

class MenuSettings
{
    public static function defaults(): array
    {
        return [
            'header' => [
                'items' => [
                    ['id' => 'home', 'label' => 'Home', 'url' => '/', 'target' => '_self', 'is_active' => true],
                    ['id' => 'about', 'label' => 'About Us', 'url' => '/about', 'target' => '_self', 'is_active' => true],
                    ['id' => 'services', 'label' => 'Services', 'url' => '/services', 'target' => '_self', 'is_active' => true],
                    ['id' => 'portfolio', 'label' => 'Portfolio', 'url' => '/portfolio', 'target' => '_self', 'is_active' => true],
                    ['id' => 'packages', 'label' => 'Packages', 'url' => '/packages', 'target' => '_self', 'is_active' => true],
                    ['id' => 'blog', 'label' => 'Blog', 'url' => '/blog', 'target' => '_self', 'is_active' => true],
                    ['id' => 'contact', 'label' => 'Contact', 'url' => '/contact', 'target' => '_self', 'is_active' => true],
                ],
                'cta' => [
                    'label' => 'Get a Quote',
                    'url' => '/contact',
                    'is_active' => true,
                ],
            ],
            'footer' => [
                'columns' => [
                    [
                        'id' => 'quick-links',
                        'title' => 'Quick Links',
                        'items' => [
                            ['id' => 'f-about', 'label' => 'About Us', 'url' => '/about', 'target' => '_self', 'is_active' => true],
                            ['id' => 'f-services', 'label' => 'Services', 'url' => '/services', 'target' => '_self', 'is_active' => true],
                            ['id' => 'f-portfolio', 'label' => 'Portfolio', 'url' => '/portfolio', 'target' => '_self', 'is_active' => true],
                            ['id' => 'f-packages', 'label' => 'Packages', 'url' => '/packages', 'target' => '_self', 'is_active' => true],
                            ['id' => 'f-blog', 'label' => 'Blog', 'url' => '/blog', 'target' => '_self', 'is_active' => true],
                        ],
                    ],
                    [
                        'id' => 'legal',
                        'title' => 'Legal',
                        'items' => [
                            ['id' => 'f-privacy', 'label' => 'Privacy Policy', 'url' => '/privacy-policy', 'target' => '_self', 'is_active' => true],
                            ['id' => 'f-terms', 'label' => 'Terms', 'url' => '/terms', 'target' => '_self', 'is_active' => true],
                            ['id' => 'f-refund', 'label' => 'Refund Policy', 'url' => '/refund-policy', 'target' => '_self', 'is_active' => true],
                        ],
                    ],
                ],
                'show_logo' => true,
                'show_contact' => true,
                'show_social' => true,
                'copyright' => '',
            ],
        ];
    }

    public static function get(): array
    {
        $saved = \App\Models\SiteSetting::where('key', 'menus')->first()?->value ?? [];

        return self::merge(self::defaults(), is_array($saved) ? $saved : []);
    }

    private static function merge(array $defaults, array $saved): array
    {
        $merged = $defaults;

        if (isset($saved['header'])) {
            $merged['header'] = array_merge($defaults['header'], $saved['header']);
            if (isset($saved['header']['items'])) {
                $merged['header']['items'] = $saved['header']['items'];
            }
            if (isset($saved['header']['cta'])) {
                $merged['header']['cta'] = array_merge($defaults['header']['cta'], $saved['header']['cta']);
            }
        }

        if (isset($saved['footer'])) {
            $merged['footer'] = array_merge($defaults['footer'], $saved['footer']);
            if (isset($saved['footer']['columns'])) {
                $merged['footer']['columns'] = $saved['footer']['columns'];
            }
        }

        return $merged;
    }
}
