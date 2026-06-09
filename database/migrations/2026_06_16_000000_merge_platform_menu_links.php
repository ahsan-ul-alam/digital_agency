<?php

use App\Models\SiteSetting;
use App\Support\MenuSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = MenuSettings::defaults();
        $saved = SiteSetting::where('key', 'menus')->first()?->value ?? [];

        if (! is_array($saved) || $saved === []) {
            SiteSetting::updateOrCreate(['key' => 'menus'], ['value' => $defaults]);

            return;
        }

        $headerItems = $saved['header']['items'] ?? [];
        $existingIds = collect($headerItems)->pluck('id')->all();

        $platformLinks = [
            ['id' => 'quote', 'label' => 'Get a Quote', 'url' => '/quote', 'target' => '_self', 'is_active' => true],
            ['id' => 'book', 'label' => 'Book a Call', 'url' => '/book', 'target' => '_self', 'is_active' => true],
            ['id' => 'careers', 'label' => 'Careers', 'url' => '/careers', 'target' => '_self', 'is_active' => true],
        ];

        foreach ($platformLinks as $link) {
            if (! in_array($link['id'], $existingIds, true)) {
                $contactIndex = collect($headerItems)->search(fn ($item) => ($item['id'] ?? '') === 'contact');
                if ($contactIndex !== false) {
                    array_splice($headerItems, $contactIndex, 0, [$link]);
                } else {
                    $headerItems[] = $link;
                }
                $existingIds[] = $link['id'];
            }
        }

        $saved['header']['items'] = $headerItems;

        $cta = array_merge($defaults['header']['cta'], $saved['header']['cta'] ?? []);
        if (($cta['url'] ?? '/contact') === '/contact' && ($cta['label'] ?? '') === 'Get a Quote') {
            $cta['url'] = '/quote';
        }
        $saved['header']['cta'] = $cta;

        $footerColumns = $saved['footer']['columns'] ?? $defaults['footer']['columns'];
        $quickLinksIndex = collect($footerColumns)->search(fn ($col) => ($col['id'] ?? '') === 'quick-links');

        if ($quickLinksIndex !== false) {
            $items = $footerColumns[$quickLinksIndex]['items'] ?? [];
            $footerIds = collect($items)->pluck('id')->all();
            $footerPlatform = [
                ['id' => 'f-quote', 'label' => 'Get a Quote', 'url' => '/quote', 'target' => '_self', 'is_active' => true],
                ['id' => 'f-book', 'label' => 'Book a Call', 'url' => '/book', 'target' => '_self', 'is_active' => true],
                ['id' => 'f-careers', 'label' => 'Careers', 'url' => '/careers', 'target' => '_self', 'is_active' => true],
            ];

            foreach ($footerPlatform as $link) {
                if (! in_array($link['id'], $footerIds, true)) {
                    $items[] = $link;
                }
            }

            $footerColumns[$quickLinksIndex]['items'] = $items;
            $saved['footer']['columns'] = $footerColumns;
        }

        SiteSetting::updateOrCreate(['key' => 'menus'], ['value' => $saved]);
    }

    public function down(): void
    {
        // Menu merges are not reversed automatically.
    }
};
