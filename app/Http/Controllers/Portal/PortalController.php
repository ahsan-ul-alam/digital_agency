<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\ClientPortalService;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function dashboard(ClientPortalService $portal): Response
    {
        $user = request()->user();
        $proposals = $portal->proposalsFor($user);
        $invoices = $portal->invoicesFor($user);
        $meetings = Booking::with('meetingType')
            ->where('email', $user->email)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->limit(5)
            ->get();

        return Inertia::render('Portal/Dashboard', [
            'user' => $user->only(['name', 'email']),
            'stats' => [
                'proposals' => $proposals->count(),
                'pending_proposals' => $proposals->where('status', 'sent')->count(),
                'invoices' => $invoices->count(),
                'outstanding' => $invoices->whereIn('status', ['sent', 'overdue'])->sum('total'),
                'meetings' => $meetings->count(),
            ],
            'upcomingMeetings' => $meetings,
            'recentProposals' => $proposals->take(3)->values(),
            'recentInvoices' => $invoices->take(3)->values(),
        ]);
    }
}
