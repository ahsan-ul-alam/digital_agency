<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\PaymentSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentSettingsController extends Controller
{
    public function edit(): Response
    {
        $stored = PaymentSettings::get();

        return Inertia::render('Admin/PaymentSettings', [
            'settings' => [
                ...$stored,
                'bkash_password' => '',
                'bkash_app_secret' => '',
                'eps_password' => '',
                'eps_hash_key' => '',
            ],
            'hasSecrets' => [
                'bkash_password' => filled($stored['bkash_password'] ?? null),
                'bkash_app_secret' => filled($stored['bkash_app_secret'] ?? null),
                'eps_password' => filled($stored['eps_password'] ?? null),
                'eps_hash_key' => filled($stored['eps_hash_key'] ?? null),
            ],
            'callbackUrls' => [
                'bkash' => url('/payments/bkash/callback/{transaction}'),
                'eps_success' => url('/payments/eps/success/{transaction}'),
                'eps_fail' => url('/payments/eps/fail/{transaction}'),
                'eps_cancel' => url('/payments/eps/cancel/{transaction}'),
                'eps_ipn' => route('payments.eps.ipn'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'bank_name' => ['nullable', 'string', 'max:160'],
            'account_name' => ['nullable', 'string', 'max:160'],
            'account_number' => ['nullable', 'string', 'max:80'],
            'routing_or_mobile' => ['nullable', 'string', 'max:120'],
            'instructions' => ['nullable', 'string', 'max:2000'],
            'support_email' => ['nullable', 'email', 'max:160'],
            'bkash_enabled' => ['sometimes', 'boolean'],
            'bkash_sandbox' => ['sometimes', 'boolean'],
            'bkash_username' => ['nullable', 'string', 'max:120'],
            'bkash_password' => ['nullable', 'string', 'max:120'],
            'bkash_app_key' => ['nullable', 'string', 'max:120'],
            'bkash_app_secret' => ['nullable', 'string', 'max:120'],
            'bkash_display_number' => ['nullable', 'string', 'max:40'],
            'eps_enabled' => ['sometimes', 'boolean'],
            'eps_sandbox' => ['sometimes', 'boolean'],
            'eps_merchant_id' => ['nullable', 'string', 'max:80'],
            'eps_store_id' => ['nullable', 'string', 'max:80'],
            'eps_username' => ['nullable', 'string', 'max:120'],
            'eps_password' => ['nullable', 'string', 'max:120'],
            'eps_hash_key' => ['nullable', 'string', 'max:200'],
        ]);

        $current = PaymentSettings::get();

        foreach (['bkash_password', 'bkash_app_secret', 'eps_password', 'eps_hash_key'] as $secretField) {
            if (blank($data[$secretField] ?? null)) {
                $data[$secretField] = $current[$secretField] ?? '';
            }
        }

        PaymentSettings::save($data);

        return back()->with('success', 'Payment instructions saved.');
    }
}
