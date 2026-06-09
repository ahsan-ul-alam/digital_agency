<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\ClientPortalService;
use App\Services\DocumentPdfService;
use App\Support\PaymentSettings;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PortalInvoiceController extends Controller
{
    public function index(ClientPortalService $portal): Response
    {
        return Inertia::render('Portal/Invoices/Index', [
            'invoices' => $portal->invoicesFor(request()->user()),
        ]);
    }

    public function show(Invoice $invoice, ClientPortalService $portal): Response
    {
        abort_unless($portal->ownsInvoice(request()->user(), $invoice), 404);

        $invoice->load(['proposal', 'payments']);

        return Inertia::render('Portal/Invoices/Show', [
            'invoice' => $invoice,
            'paymentSummary' => [
                'paid_total' => $invoice->paidTotal(),
                'balance_due' => $invoice->balanceDue(),
            ],
            'paymentInstructions' => PaymentSettings::get(),
            'paymentGateways' => PaymentSettings::portalGateways(),
        ]);
    }

    public function pdf(Invoice $invoice, ClientPortalService $portal, DocumentPdfService $pdf): SymfonyResponse
    {
        abort_unless($portal->ownsInvoice(request()->user(), $invoice), 404);

        return $pdf->invoice($invoice);
    }
}
