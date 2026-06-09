<?php

namespace App\Mail;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProposalMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Proposal $proposal, public string $pdfBinary) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Proposal '.$this->proposal->number.' — '.$this->proposal->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '<p>Hello '.$this->proposal->client_name.',</p><p>Please find attached our proposal <strong>'.$this->proposal->number.'</strong> for <em>'.$this->proposal->title.'</em>.</p><p>Thank you,<br>AR Soft BD</p>',
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->pdfBinary, $this->proposal->number.'.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
