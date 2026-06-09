<?php

namespace App\Support;

class GatewayHash
{
    public static function eps(string $data, string $secretKey): string
    {
        $digest = hash_hmac('sha512', $data, $secretKey, true);

        return base64_encode($digest);
    }
}
