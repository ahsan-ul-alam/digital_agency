<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->trim();

        $query = Booking::with(['meetingType', 'lead'])->latest('scheduled_at');

        if ($status->isNotEmpty() && $status !== 'all' && in_array($status->toString(), Booking::STATUSES, true)) {
            $query->where('status', $status->toString());
        }

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $query->paginate(20)->withQueryString(),
            'filters' => ['status' => $status->isNotEmpty() ? $status->toString() : 'all'],
            'stats' => [
                'total' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'upcoming' => Booking::whereIn('status', ['pending', 'confirmed'])->where('scheduled_at', '>=', now())->count(),
            ],
            'statuses' => collect(Booking::STATUS_LABELS)->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])->values(),
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['meetingType', 'lead']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
            'statuses' => collect(Booking::STATUS_LABELS)->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])->values(),
        ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', Booking::STATUSES)],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $booking->update($data);

        return back()->with('success', 'Booking updated.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Booking deleted.');
    }
}
