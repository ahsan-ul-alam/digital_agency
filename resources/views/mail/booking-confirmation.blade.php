<x-mail::message>
@if ($forAdmin)
# New meeting booking

**Client:** {{ $booking->name }} ({{ $booking->email }})

**Meeting:** {{ $booking->meetingType->name }}

**When:** {{ $booking->scheduled_at->timezone($booking->timezone)->format('l, M j, Y \a\t g:i A T') }}

@if ($booking->notes)
**Notes:** {{ $booking->notes }}
@endif

<x-mail::button :url="url('/admin/bookings/'.$booking->id)">
View in admin
</x-mail::button>
@else
# Your meeting is booked

Hi {{ $booking->name }},

We've received your booking request for **{{ $booking->meetingType->name }}**.

**When:** {{ $booking->scheduled_at->timezone($booking->timezone)->format('l, M j, Y \a\t g:i A T') }}

Our team will confirm the slot shortly. If you need to reschedule, reply to this email.

Thanks,<br>
{{ config('app.name') }}
@endif
</x-mail::message>
