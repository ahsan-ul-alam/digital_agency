<x-mail::message>
# Welcome to your client portal

Hi {{ $user->name }},

Your AR Soft BD client portal is ready. Sign in to review proposals, invoices, and meetings.

**Login:** [{{ $loginUrl }}]({{ $loginUrl }})

**Email:** {{ $user->email }}

**Temporary password:** {{ $password }}

Please change your password after your first login.

<x-mail::button :url="$portalUrl">
Open client portal
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
