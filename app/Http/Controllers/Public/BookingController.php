<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MeetingType;
use App\Services\BookingService;
use App\Support\BookingSettings;
use App\Support\SeoBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function show(BookingService $booking): Response
    {
        return Inertia::render('Public/BookMeeting', [
            'types' => MeetingType::where('is_active', true)->orderBy('sort_order')->get(),
            'dates' => $booking->upcomingDates(),
            'settings' => BookingSettings::get(),
            'seo' => SeoBuilder::forStatic('Book a Meeting', 'Schedule a discovery call or consultation with the AR Soft BD team.', '/book'),
        ]);
    }

    public function slots(Request $request, BookingService $booking)
    {
        $data = $request->validate([
            'meeting_type_id' => ['required', 'integer', 'exists:meeting_types,id'],
            'date' => ['required', 'date'],
        ]);

        $type = MeetingType::findOrFail($data['meeting_type_id']);

        return response()->json([
            'slots' => $booking->availableSlots($type, $data['date']),
        ]);
    }

    public function store(Request $request, BookingService $booking): RedirectResponse
    {
        $data = $request->validate([
            'meeting_type_id' => ['required', 'integer', 'exists:meeting_types,id'],
            'scheduled_at' => ['required', 'date'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:60'],
            'company' => ['nullable', 'string', 'max:160'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $type = MeetingType::findOrFail($data['meeting_type_id']);
        $booking->create($data, $type);

        return back()->with('success', 'Your meeting has been booked. We will confirm your slot shortly.');
    }
}
