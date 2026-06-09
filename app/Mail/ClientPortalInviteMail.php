<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientPortalInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public string $password) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your AR Soft BD client portal access',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.client-portal-invite',
            with: [
                'user' => $this->user,
                'password' => $this->password,
                'loginUrl' => url('/login'),
                'portalUrl' => url('/portal'),
            ],
        );
    }
}
