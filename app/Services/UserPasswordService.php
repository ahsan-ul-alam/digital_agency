<?php

namespace App\Services;

use App\Mail\PasswordRegeneratedMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserPasswordService
{
    public function regenerate(User $user, bool $sendEmail = true): string
    {
        $password = Str::password(12);

        $user->update([
            'password' => Hash::make($password),
        ]);

        if ($sendEmail) {
            try {
                Mail::to($user->email)->send(new PasswordRegeneratedMail($user, $password));
            } catch (\Throwable) {
                // Mail may be unconfigured in local dev (log driver).
            }
        }

        return $password;
    }
}
