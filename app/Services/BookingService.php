<?php

namespace App\Services;

use App\Mail\BookingConfirmationMail;
use App\Models\Booking;
use App\Models\MeetingType;
use App\Support\BookingSettings;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

class BookingService
{
    public function __construct(private LeadService $leads) {}

    public function availableSlots(MeetingType $type, string $date): array
    {
        $settings = BookingSettings::get();
        $timezone = $settings['timezone'];
        $day = Carbon::parse($date, $timezone)->startOfDay();

        if (! in_array($day->dayOfWeekIso, $settings['weekdays'], true)) {
            return [];
        }

        $start = $day->copy()->setTimeFromTimeString($settings['daily_start']);
        $end = $day->copy()->setTimeFromTimeString($settings['daily_end']);
        $duration = max(15, (int) $type->duration_minutes);
        $buffer = max(0, (int) ($settings['buffer_minutes'] ?? 0));
        $step = $duration + $buffer;

        $booked = Booking::query()
            ->whereDate('scheduled_at', $day->toDateString())
            ->whereIn('status', ['pending', 'confirmed'])
            ->get()
            ->map(fn (Booking $booking) => $booking->scheduled_at->copy()->setTimezone($timezone));

        $slots = collect();
        $cursor = $start->copy();

        while ($cursor->copy()->addMinutes($duration)->lte($end)) {
            if ($cursor->isFuture()) {
                $overlap = $booked->contains(function (Carbon $existing) use ($cursor, $duration, $timezone) {
                    $existingStart = $existing->copy()->setTimezone($timezone);
                    $existingEnd = $existingStart->copy()->addMinutes($duration);

                    return $cursor->lt($existingEnd) && $cursor->copy()->addMinutes($duration)->gt($existingStart);
                });

                if (! $overlap) {
                    $slots->push([
                        'value' => $cursor->toIso8601String(),
                        'label' => $cursor->format('g:i A'),
                    ]);
                }
            }

            $cursor->addMinutes($step);
        }

        return $slots->values()->all();
    }

    public function upcomingDates(): Collection
    {
        $settings = BookingSettings::get();
        $timezone = $settings['timezone'];
        $daysAhead = max(1, (int) $settings['days_ahead']);

        return collect(range(0, $daysAhead - 1))
            ->map(fn (int $offset) => now($timezone)->addDays($offset)->startOfDay())
            ->filter(fn (Carbon $day) => in_array($day->dayOfWeekIso, $settings['weekdays'], true))
            ->map(fn (Carbon $day) => [
                'value' => $day->toDateString(),
                'label' => $day->format('D, M j'),
            ])
            ->values();
    }

    public function create(array $data, MeetingType $type): Booking
    {
        $settings = BookingSettings::get();
        $scheduledAt = Carbon::parse($data['scheduled_at'])->setTimezone($settings['timezone']);

        $lead = $this->leads->recordFromContact([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'service' => $type->name,
            'message' => trim(($data['notes'] ?? '')."\n\nBooked meeting: {$type->name} on ".$scheduledAt->format('M j, Y g:i A')),
        ], 'meeting_booking', null);

        $booking = Booking::create([
            'meeting_type_id' => $type->id,
            'lead_id' => $lead->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'scheduled_at' => $scheduledAt,
            'timezone' => $settings['timezone'],
            'status' => 'pending',
            'notes' => $data['notes'] ?? null,
        ]);

        try {
            Mail::to($booking->email)->send(new BookingConfirmationMail($booking, false));
            Mail::to(config('mail.from.address'))->send(new BookingConfirmationMail($booking, true));
        } catch (\Throwable) {
            // Mail may be unconfigured in local dev (log driver).
        }

        return $booking;
    }
}
