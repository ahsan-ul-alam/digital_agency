<?php

namespace App\Support;

class ThemePalette
{
    /**
     * Calm professional palette — easy on the eyes, trustworthy and reliable.
     * Used when seeding or filling missing theme keys in the database.
     */
    public static function defaults(): array
    {
        return [
            'primary' => '#4d8f9f',
            'primary_hover' => '#3f7a88',
            'secondary' => '#5a7d9a',
            'accent' => '#6b9eb8',
            'background' => '#0f1419',
            'surface' => '#1a222d',
            'text' => '#e8edf3',
            'text_muted' => '#8fa3b8',
            'gradient_from' => '#4d8f9f',
            'gradient_via' => '#5a7d9a',
            'gradient_to' => '#6b9eb8',
            'glow_primary' => '77, 143, 159',
            'glow_secondary' => '90, 125, 154',
            'button_text' => '#0f1419',
        ];
    }

    public static function cssVariables(array $theme): string
    {
        $t = array_merge(self::defaults(), $theme);

        return collect([
            '--color-primary' => $t['primary'],
            '--color-primary-hover' => $t['primary_hover'],
            '--color-secondary' => $t['secondary'],
            '--color-accent' => $t['accent'],
            '--color-background' => $t['background'],
            '--color-surface' => $t['surface'],
            '--color-text' => $t['text'],
            '--color-text-muted' => $t['text_muted'],
            '--color-gradient-from' => $t['gradient_from'],
            '--color-gradient-via' => $t['gradient_via'],
            '--color-gradient-to' => $t['gradient_to'],
            '--color-glow-primary' => $t['glow_primary'],
            '--color-glow-secondary' => $t['glow_secondary'],
            '--color-button-text' => $t['button_text'],
        ])->map(fn ($value, $key) => "{$key}: {$value}")->implode('; ');
    }
}
