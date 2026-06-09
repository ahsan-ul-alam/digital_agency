<?php

namespace App\Support;

use App\Models\SiteSetting;

class BookingSettings
{
    public static function defaults(): array
    {
        return [
            'timezone' => 'Asia/Dhaka',
            'days_ahead' => 14,
            'slot_duration' => 30,
            'daily_start' => '09:00',
            'daily_end' => '17:00',
            'weekdays' => [1, 2, 3, 4, 5],
            'buffer_minutes' => 0,
        ];
    }

    public static function get(): array
    {
        $stored = SiteSetting::where('key', 'booking')->first()?->value ?? [];

        return array_merge(self::defaults(), is_array($stored) ? $stored : []);
    }

    public static function save(array $data): void
    {
        SiteSetting::updateOrCreate(
            ['key' => 'booking'],
            ['value' => array_merge(self::get(), $data)]
        );
    }
}
