<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Proposal;
use App\Services\DocumentPdfService;
use App\Services\InvoicePaymentService;
use App\Support\LineItemCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => Invoice::latest()->paginate(20),
            'stats' => [
                'total' => Invoice::count(),
                'paid' => Invoice::where('status', 'paid')->count(),
                'outstanding' => Invoice::whereIn('status', ['sent', 'overdue'])->sum('total'),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $proposal = $request->filled('proposal_id') ? Proposal::with('lead')->find($request->integer('proposal_id')) : null;

        return Inertia::render('Admin/Invoices/Form', [
            'invoice' => null,
            'proposal' => $proposal,
            'statuses' => $this->statusOptions(),
            'defaults' => $proposal ? [
                'proposal_id' => $proposal->id,
                'lead_id' => $proposal->lead_id,
                'client_name' => $proposal->client_name,
                'client_email' => $proposal->client_email,
                'client_company' => $proposal->client_company,
                'line_items' => $proposal->line_items,
                'tax_percent' => $proposal->tax_percent,
                'due_date' => now()->addDays(7)->toDateString(),
                'notes' => $proposal->notes,
            ] : [
                'line_items' => [['description' => '', 'quantity' => 1, 'unit_price' => 0]],
                'tax_percent' => 0,
                'due_date' => now()->addDays(7)->toDateString(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $totals = LineItemCalculator::totals($data['line_items'], (float) $data['tax_percent']);

        $invoice = Invoice::create([
            ...$data,
            'invoice_number' => Invoice::nextNumber(),
            'line_items' => $totals['lineItems'],
            'subtotal' => $totals['subtotal'],
            'tax_amount' => $totals['taxAmount'],
            'total' => $totals['total'],
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.invoices.edit', $invoice)->with('success', 'Invoice created.');
    }

    public function edit(Invoice $invoice): Response
    {
        $invoice->load(['proposal', 'lead', 'payments.recorder']);

        return Inertia::render('Admin/Invoices/Form', [
            'invoice' => $invoice,
            'proposal' => $invoice->proposal,
            'statuses' => $this->statusOptions(),
            'paymentMethods' => collect(\App\Models\InvoicePayment::METHODS)->map(fn ($label, $value) => compact('value', 'label'))->values(),
            'paymentSummary' => [
                'paid_total' => $invoice->paidTotal(),
                'balance_due' => $invoice->balanceDue(),
            ],
            'defaults' => null,
        ]);
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $data = $this->validated($request);
        $totals = LineItemCalculator::totals($data['line_items'], (float) $data['tax_percent']);

        $payload = [
            ...$data,
            'line_items' => $totals['lineItems'],
            'subtotal' => $totals['subtotal'],
            'tax_amount' => $totals['taxAmount'],
            'total' => $totals['total'],
        ];

        if ($data['status'] === 'paid' && ! $invoice->paid_at) {
            $payload['paid_at'] = now();
        }

        $invoice->update($payload);

        return back()->with('success', 'Invoice updated.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()->route('admin.invoices.index')->with('success', 'Invoice deleted.');
    }

    public function pdf(Invoice $invoice, DocumentPdfService $pdf)
    {
        return $pdf->invoice($invoice);
    }

    public function storePayment(Request $request, Invoice $invoice, InvoicePaymentService $payments): RedirectResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'method' => ['required', 'in:'.implode(',', array_keys(\App\Models\InvoicePayment::METHODS))],
            'reference' => ['nullable', 'string', 'max:120'],
            'paid_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $payments->record($invoice, $data, $request->user());

        return back()->with('success', 'Payment recorded.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'proposal_id' => ['nullable', 'integer', 'exists:proposals,id'],
            'lead_id' => ['nullable', 'integer', 'exists:leads,id'],
            'client_name' => ['required', 'string', 'max:160'],
            'client_email' => ['required', 'email', 'max:160'],
            'client_company' => ['nullable', 'string', 'max:160'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.description' => ['required', 'string', 'max:500'],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
            'line_items.*.unit_price' => ['required', 'integer', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'tax_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', 'in:'.implode(',', Invoice::STATUSES)],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);
    }

    private function statusOptions(): array
    {
        return collect(Invoice::STATUS_LABELS)->map(fn ($label, $value) => compact('value', 'label'))->values()->all();
    }
}
