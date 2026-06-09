<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewLeadMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Lead $lead) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New lead: '.$this->lead->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        $lead = $this->lead;
        $url = url('/admin/leads/'.$lead->id);
        $rows = collect([
            'Name' => $lead->name,
            'Email' => $lead->email,
            'Phone' => $lead->phone,
            'Company' => $lead->company,
            'Service' => $lead->service,
            'Budget' => $lead->budget,
            'Source' => $lead->source_label,
        ])->filter();

        $details = $rows->map(fn ($value, $label) => "<tr><td style=\"padding:6px 12px;font-weight:600;\">{$label}</td><td style=\"padding:6px 12px;\">".e($value).'</td></tr>')->join('');
        $message = nl2br(e($lead->message ?? ''));

        return <<<HTML
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
            <h2 style="margin:0 0 12px;">New lead received</h2>
            <p style="margin:0 0 16px;">A new inquiry was submitted on your website.</p>
            <table style="border-collapse:collapse;width:100%;max-width:560px;">{$details}</table>
            <h3 style="margin:24px 0 8px;">Message</h3>
            <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">{$message}</div>
            <p style="margin:24px 0 0;"><a href="{$url}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:999px;">View lead in CRM</a></p>
        </div>
        HTML;
    }
}
