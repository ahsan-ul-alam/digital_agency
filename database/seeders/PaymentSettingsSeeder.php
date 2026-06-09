<?php

namespace Database\Seeders;

use App\Support\PaymentSettings;
use Illuminate\Database\Seeder;

class PaymentSettingsSeeder extends Seeder
{
    public function run(): void
    {
        PaymentSettings::save(PaymentSettings::sandboxDefaults());
    }
}
