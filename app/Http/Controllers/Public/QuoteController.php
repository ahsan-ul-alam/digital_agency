<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\QuoteType;
use App\Services\LeadService;
use App\Services\QuoteCalculatorService;
use App\Support\SeoBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Public/QuoteCalculator', [
            'types' => QuoteType::where('is_active', true)->orderBy('sort_order')->get(),
            'seo' => SeoBuilder::forStatic('Project Quote Calculator', 'Estimate your project budget and request a tailored proposal from AR Soft BD.', '/quote'),
        ]);
    }

    public function estimate(Request $request, QuoteCalculatorService $calculator)
    {
        $data = $request->validate([
            'quote_type_id' => ['required', 'integer', 'exists:quote_types,id'],
            'selections' => ['nullable', 'array'],
        ]);

        $type = QuoteType::findOrFail($data['quote_type_id']);

        return response()->json($calculator->calculate($type, $data['selections'] ?? []));
    }

    public function submit(Request $request, QuoteCalculatorService $calculator, LeadService $leads): RedirectResponse
    {
        $data = $request->validate([
            'quote_type_id' => ['required', 'integer', 'exists:quote_types,id'],
            'selections' => ['nullable', 'array'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:60'],
            'company' => ['nullable', 'string', 'max:160'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $type = QuoteType::findOrFail($data['quote_type_id']);
        $estimate = $calculator->calculate($type, $data['selections'] ?? []);

        $breakdown = collect($estimate['breakdown'])
            ->map(fn ($row) => "{$row['label']}: ".$calculator->formatMoney($row['amount'], $estimate['currency']))
            ->join("\n");

        $leads->recordFromQuote([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'service' => $type->name,
            'budget' => $calculator->formatMoney($estimate['total'], $estimate['currency']),
            'message' => trim(($data['message'] ?? '')."\n\n--- Quote estimate ---\n{$breakdown}\nTotal: ".$calculator->formatMoney($estimate['total'], $estimate['currency'])),
            'source_meta' => [
                'quote_type_id' => $type->id,
                'quote_type' => $type->slug,
                'selections' => $data['selections'] ?? [],
                'estimate' => $estimate,
            ],
        ]);

        return back()->with('success', 'Thanks! Your estimate request has been received. Our team will follow up shortly.');
    }
}
