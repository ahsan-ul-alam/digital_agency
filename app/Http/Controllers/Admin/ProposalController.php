<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ProposalMail;
use App\Models\Lead;
use App\Models\Proposal;
use App\Services\DocumentPdfService;
use App\Services\LeadService;
use App\Support\LineItemCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ProposalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Proposals/Index', [
            'proposals' => Proposal::with('lead')->latest()->paginate(20),
            'stats' => [
                'total' => Proposal::count(),
                'draft' => Proposal::where('status', 'draft')->count(),
                'sent' => Proposal::where('status', 'sent')->count(),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $lead = $request->filled('lead_id') ? Lead::find($request->integer('lead_id')) : null;

        return Inertia::render('Admin/Proposals/Form', [
            'proposal' => null,
            'lead' => $lead,
            'statuses' => $this->statusOptions(),
            'defaults' => [
                'client_name' => $lead?->name ?? '',
                'client_email' => $lead?->email ?? '',
                'client_company' => $lead?->company ?? '',
                'title' => $lead ? "Proposal for {$lead->service}" : 'Project Proposal',
                'line_items' => $lead?->service ? [
                    ['description' => $lead->service, 'quantity' => 1, 'unit_price' => 0],
                ] : [['description' => '', 'quantity' => 1, 'unit_price' => 0]],
                'timeline' => '4–8 weeks',
                'valid_until' => now()->addDays(14)->toDateString(),
                'tax_percent' => 0,
            ],
        ]);
    }

    public function store(Request $request, LeadService $leads): RedirectResponse
    {
        $data = $this->validated($request);
        $totals = LineItemCalculator::totals($data['line_items'], (float) $data['tax_percent']);

        $proposal = Proposal::create([
            ...$data,
            'number' => Proposal::nextNumber(),
            'line_items' => $totals['lineItems'],
            'subtotal' => $totals['subtotal'],
            'tax_amount' => $totals['taxAmount'],
            'total' => $totals['total'],
            'created_by' => $request->user()->id,
        ]);

        if ($proposal->lead_id) {
            $lead = Lead::find($proposal->lead_id);
            if ($lead && $lead->status === 'new') {
                $leads->updateStatus($lead, 'qualified', $request->user());
            }
        }

        return redirect()->route('admin.proposals.edit', $proposal)->with('success', 'Proposal created.');
    }

    public function edit(Proposal $proposal): Response
    {
        $proposal->load('lead');

        return Inertia::render('Admin/Proposals/Form', [
            'proposal' => $proposal,
            'lead' => $proposal->lead,
            'statuses' => $this->statusOptions(),
            'defaults' => null,
        ]);
    }

    public function update(Request $request, Proposal $proposal): RedirectResponse
    {
        $data = $this->validated($request);
        $totals = LineItemCalculator::totals($data['line_items'], (float) $data['tax_percent']);

        $proposal->update([
            ...$data,
            'line_items' => $totals['lineItems'],
            'subtotal' => $totals['subtotal'],
            'tax_amount' => $totals['taxAmount'],
            'total' => $totals['total'],
        ]);

        return back()->with('success', 'Proposal updated.');
    }

    public function destroy(Proposal $proposal): RedirectResponse
    {
        $proposal->delete();

        return redirect()->route('admin.proposals.index')->with('success', 'Proposal deleted.');
    }

    public function pdf(Proposal $proposal, DocumentPdfService $pdf)
    {
        return $pdf->proposal($proposal);
    }

    public function send(Request $request, Proposal $proposal, DocumentPdfService $pdf): RedirectResponse
    {
        try {
            Mail::to($proposal->client_email)->send(new ProposalMail($proposal, $pdf->proposalBinary($proposal)));
            $proposal->update(['status' => 'sent', 'sent_at' => now()]);
            if ($proposal->lead_id) {
                $lead = Lead::find($proposal->lead_id);
                if ($lead) {
                    app(LeadService::class)->updateStatus($lead, 'proposal_sent', $request->user());
                }
            }
        } catch (\Throwable) {
            return back()->with('error', 'Could not send email. Check mail settings.');
        }

        return back()->with('success', 'Proposal emailed to client.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'lead_id' => ['nullable', 'integer', 'exists:leads,id'],
            'client_name' => ['required', 'string', 'max:160'],
            'client_email' => ['required', 'email', 'max:160'],
            'client_company' => ['nullable', 'string', 'max:160'],
            'title' => ['required', 'string', 'max:220'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.description' => ['required', 'string', 'max:500'],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
            'line_items.*.unit_price' => ['required', 'integer', 'min:0'],
            'timeline' => ['nullable', 'string', 'max:160'],
            'valid_until' => ['nullable', 'date'],
            'tax_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', 'in:'.implode(',', Proposal::STATUSES)],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);
    }

    private function statusOptions(): array
    {
        return collect(Proposal::STATUS_LABELS)->map(fn ($label, $value) => compact('value', 'label'))->values()->all();
    }
}
