<?php

namespace App\Support;

use App\Models\SiteSetting;

class PaymentSettings
{
    public static function defaults(): array
    {
        return [
            'bank_name' => '',
            'account_name' => 'AR Soft BD',
            'account_number' => '',
            'routing_or_mobile' => '',
            'instructions' => 'Please include your invoice number in the payment reference. We will confirm receipt within one business day.',
            'support_email' => '',
            'bkash_enabled' => false,
            'bkash_sandbox' => true,
            'bkash_username' => '',
            'bkash_password' => '',
            'bkash_app_key' => '',
            'bkash_app_secret' => '',
            'bkash_display_number' => '',
            'eps_enabled' => false,
            'eps_sandbox' => true,
            'eps_merchant_id' => '',
            'eps_store_id' => '',
            'eps_username' => '',
            'eps_password' => '',
            'eps_hash_key' => '',
        ];
    }

    /**
     * Public sandbox credentials for local development and testing.
     * Replace with live merchant credentials before production.
     */
    public static function sandboxDefaults(): array
    {
        return array_merge(self::defaults(), [
            'bank_name' => 'Dutch-Bangla Bank',
            'account_name' => 'AR Soft BD',
            'account_number' => '1234567890123',
            'routing_or_mobile' => 'bKash: 01700-000000 (manual transfer)',
            'instructions' => 'For online payment, use Pay with bKash or Pay with EPS above. For bank transfer, include your invoice number in the reference.',
            'support_email' => 'billing@arsoftbd.com',
            'bkash_enabled' => true,
            'bkash_sandbox' => true,
            'bkash_username' => 'sandboxTokenizedUser02',
            'bkash_password' => 'sandboxTokenizedUser02@12345',
            'bkash_app_key' => '4f6o0cjiki2rfm34kfdadl1eqq',
            'bkash_app_secret' => '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b',
            'bkash_display_number' => '01770618575',
            'eps_enabled' => true,
            'eps_sandbox' => true,
            'eps_merchant_id' => '29e86e70-0ac6-45eb-ba04-9fcb0aaed12a',
            'eps_store_id' => 'd44e705f-9e3a-41de-98b1-1674631637da',
            'eps_username' => 'Epsdemo@gmail.com',
            'eps_password' => 'Epsdemo258@',
            'eps_hash_key' => 'FHZxyzeps56789gfhg678ygu876o=',
        ]);
    }

    public static function bkashReady(): bool
    {
        $settings = self::get();

        return ! empty($settings['bkash_enabled'])
            && filled($settings['bkash_username'])
            && filled($settings['bkash_password'])
            && filled($settings['bkash_app_key'])
            && filled($settings['bkash_app_secret']);
    }

    public static function epsReady(): bool
    {
        $settings = self::get();

        return ! empty($settings['eps_enabled'])
            && filled($settings['eps_merchant_id'])
            && filled($settings['eps_store_id'])
            && filled($settings['eps_username'])
            && filled($settings['eps_password'])
            && filled($settings['eps_hash_key']);
    }

    public static function portalGateways(): array
    {
        return [
            'bkash' => self::bkashReady(),
            'eps' => self::epsReady(),
        ];
    }

    public static function get(): array
    {
        $stored = SiteSetting::where('key', 'payments')->first()?->value ?? [];

        return array_merge(self::defaults(), is_array($stored) ? $stored : []);
    }

    public static function save(array $data): void
    {
        SiteSetting::updateOrCreate(
            ['key' => 'payments'],
            ['value' => array_merge(self::get(), $data)]
        );
    }
}
