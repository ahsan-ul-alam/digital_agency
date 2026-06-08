<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\ThemePalette;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ThemeController extends Controller
{
    public function defaults(): array
    {
        return ThemePalette::defaults();
    }

    public function edit(): Response
    {
        $stored = SiteSetting::where('key', 'theme')->first()?->value ?? [];

        return Inertia::render('Admin/ThemeSettings', [
            'theme' => array_merge($this->defaults(), $stored),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'primary' => ['required', 'string', 'max:20'],
            'primary_hover' => ['required', 'string', 'max:20'],
            'secondary' => ['required', 'string', 'max:20'],
            'accent' => ['required', 'string', 'max:20'],
            'background' => ['required', 'string', 'max:20'],
            'surface' => ['required', 'string', 'max:20'],
            'text' => ['required', 'string', 'max:20'],
            'text_muted' => ['required', 'string', 'max:20'],
            'gradient_from' => ['required', 'string', 'max:20'],
            'gradient_via' => ['required', 'string', 'max:20'],
            'gradient_to' => ['required', 'string', 'max:20'],
            'glow_primary' => ['required', 'string', 'max:30'],
            'glow_secondary' => ['required', 'string', 'max:30'],
            'button_text' => ['required', 'string', 'max:20'],
        ]);

        SiteSetting::updateOrCreate(['key' => 'theme'], ['value' => $data]);

        return back()->with('success', 'Theme colors updated. Changes are live on the website.');
    }
}
