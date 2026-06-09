<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;
use Inertia\Response;

class PortalMeetingController extends Controller
{
    public function index(): Response
    {
        $user = request()->user();

        $bookings = Booking::with('meetingType')
            ->where('email', $user->email)
            ->latest('scheduled_at')
            ->get();

        return Inertia::render('Portal/Meetings/Index', [
            'bookings' => $bookings,
        ]);
    }
}
