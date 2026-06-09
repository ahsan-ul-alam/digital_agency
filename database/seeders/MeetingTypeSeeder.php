<?php

namespace Database\Seeders;

use App\Models\MeetingType;
use Illuminate\Database\Seeder;

class MeetingTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'slug' => 'discovery-call',
                'name' => 'Discovery Call',
                'description' => 'A 30-minute intro call to understand your goals, timeline and budget.',
                'duration_minutes' => 30,
                'sort_order' => 1,
            ],
            [
                'slug' => 'project-consultation',
                'name' => 'Project Consultation',
                'description' => 'A deeper 60-minute session to review requirements and solution options.',
                'duration_minutes' => 60,
                'sort_order' => 2,
            ],
        ];

        foreach ($types as $type) {
            MeetingType::updateOrCreate(['slug' => $type['slug']], $type);
        }
    }
}
