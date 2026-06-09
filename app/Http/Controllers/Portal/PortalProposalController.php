<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use App\Services\ClientPortalService;
use App\Services\DocumentPdfService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PortalProposalController extends Controller
{
    public function index(ClientPortalService $portal): Response
    {
        return Inertia::render('Portal/Proposals/Index', [
            'proposals' => $portal->proposalsFor(request()->user()),
        ]);
    }

    public function show(Proposal $proposal, ClientPortalService $portal): Response
    {
        abort_unless($portal->ownsProposal(request()->user(), $proposal), 404);

        return Inertia::render('Portal/Proposals/Show', [
            'proposal' => $proposal,
        ]);
    }

    public function respond(Request $request, Proposal $proposal, ClientPortalService $portal): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:accepted,declined'],
        ]);

        $portal->respondToProposal($request->user(), $proposal, $data['status']);

        return back()->with('success', 'Proposal '.$data['status'].'.');
    }

    public function pdf(Proposal $proposal, ClientPortalService $portal, DocumentPdfService $pdf): SymfonyResponse
    {
        abort_unless($portal->ownsProposal(request()->user(), $proposal), 404);

        return $pdf->proposal($proposal);
    }
}
