<?php

namespace App\Support;

use App\Models\User;

class PaymentHelpers
{
    public static function bkashPayerReference(User $user): string
    {
        $phone = preg_replace('/\D/', '', (string) ($user->lead?->phone ?? ''));

        if (str_starts_with($phone, '880') && strlen($phone) === 13) {
            $phone = '0'.substr($phone, 3);
        }

        if (preg_match('/^01\d{9}$/', $phone)) {
            return $phone;
        }

        return '01770618575';
    }

    public static function formatBkashAmount(int $amount): string
    {
        return number_format($amount, 2, '.', '');
    }
}
