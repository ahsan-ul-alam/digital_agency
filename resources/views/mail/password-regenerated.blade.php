<x-mail::message>
# Password reset

Hi {{ $user->name }},

An administrator generated a new password for your {{ $isClient ? 'client portal' : 'admin' }} account.

**Email:** {{ $user->email }}  
**New password:** {{ $password }}

<x-mail::button :url="$loginUrl">
Sign in
</x-mail::button>

@if ($isClient)
You can access your proposals, invoices, and meetings at [{{ $portalUrl }}]({{ $portalUrl }}).
@endif

Please change this password after signing in if your account supports it.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
