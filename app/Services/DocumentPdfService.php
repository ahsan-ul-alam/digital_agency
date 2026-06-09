<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Proposal;
use App\Models\SiteSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class DocumentPdfService
{
    public function proposal(Proposal $proposal): Response
    {
        $proposal->loadMissing('lead', 'creator');

        return Pdf::loadView('pdf.proposal', [
            'proposal' => $proposal,
            'site' => $this->siteBranding(),
        ])->download($proposal->number.'.pdf');
    }

    public function invoice(Invoice $invoice): Response
    {
        $invoice->loadMissing('lead', 'proposal', 'creator');

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'site' => $this->siteBranding(),
        ])->download($invoice->invoice_number.'.pdf');
    }

    public function proposalBinary(Proposal $proposal): string
    {
        $proposal->loadMissing('lead', 'creator');

        return Pdf::loadView('pdf.proposal', [
            'proposal' => $proposal,
            'site' => $this->siteBranding(),
        ])->output();
    }

    private function siteBranding(): array
    {
        $site = SiteSetting::where('key', 'site')->first()?->value ?? [];
        $contact = $site['contact'] ?? [];

        return [
            'name' => $site['name'] ?? 'AR Soft BD',
            'tagline' => $site['tagline'] ?? '',
            'email' => $contact['email'] ?? null,
            'phone' => $contact['phone'] ?? null,
            'address' => $contact['address'] ?? null,
        ];
    }
}
