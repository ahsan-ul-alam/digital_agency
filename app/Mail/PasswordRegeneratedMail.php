<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordRegeneratedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public string $password) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->user->isClient()
                ? 'Your AR Soft BD client portal password was reset'
                : 'Your AR Soft BD admin password was reset',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.password-regenerated',
            with: [
                'user' => $this->user,
                'password' => $this->password,
                'loginUrl' => url('/login'),
                'portalUrl' => url('/portal'),
                'isClient' => $this->user->isClient(),
            ],
        );
    }
}
