<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuoteType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Quotes/Index', [
            'types' => QuoteType::orderBy('sort_order')->get(),
        ]);
    }

    public function edit(QuoteType $quoteType): Response
    {
        return Inertia::render('Admin/Quotes/Form', [
            'type' => $quoteType,
        ]);
    }

    public function update(Request $request, QuoteType $quoteType): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:1000'],
            'base_price' => ['required', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'max:8'],
            'is_active' => ['boolean'],
            'options' => ['nullable', 'array'],
            'options.*.key' => ['required_with:options', 'string', 'max:80'],
            'options.*.label' => ['required_with:options', 'string', 'max:160'],
            'options.*.type' => ['required_with:options', 'in:toggle,number,select'],
            'options.*.price' => ['nullable', 'integer', 'min:0'],
            'options.*.unit_price' => ['nullable', 'integer', 'min:0'],
            'options.*.min' => ['nullable', 'integer', 'min:0'],
            'options.*.max' => ['nullable', 'integer', 'min:0'],
            'options.*.default' => ['nullable'],
            'options.*.choices' => ['nullable', 'array'],
        ]);

        $quoteType->update($data);

        return redirect()->route('admin.quotes.index')->with('success', 'Quote type updated.');
    }
}
