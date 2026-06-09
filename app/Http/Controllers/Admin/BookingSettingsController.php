<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\BookingSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingSettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/BookingSettings', [
            'settings' => BookingSettings::get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'timezone' => ['required', 'string', 'max:64'],
            'days_ahead' => ['required', 'integer', 'min:1', 'max:60'],
            'slot_duration' => ['required', 'integer', 'min:15', 'max:180'],
            'daily_start' => ['required', 'string', 'max:8'],
            'daily_end' => ['required', 'string', 'max:8'],
            'weekdays' => ['required', 'array', 'min:1'],
            'weekdays.*' => ['integer', 'min:1', 'max:7'],
            'buffer_minutes' => ['nullable', 'integer', 'min:0', 'max:120'],
        ]);

        BookingSettings::save($data);

        return back()->with('success', 'Booking settings saved.');
    }
}
