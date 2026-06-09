<?php

namespace App\Services;

use App\Mail\ClientPortalInviteMail;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ClientPortalService
{
    public function __construct(private LeadService $leads) {}

    public function invite(Lead $lead): array
    {
        $existing = User::where('email', $lead->email)->first();

        if ($existing) {
            if ($existing->isClient()) {
                return ['user' => $existing, 'password' => null, 'created' => false, 'error' => null];
            }

            return ['user' => null, 'password' => null, 'created' => false, 'error' => 'A staff account already exists for this email.'];
        }

        $password = Str::password(12);

        $user = User::create([
            'name' => $lead->name,
            'email' => $lead->email,
            'password' => Hash::make($password),
            'account_type' => 'client',
            'lead_id' => $lead->id,
        ]);

        try {
            Mail::to($user->email)->send(new ClientPortalInviteMail($user, $password));
        } catch (\Throwable) {
            // Mail may be unconfigured in local dev (log driver).
        }

        $this->leads->addSystemNote($lead, 'Client portal account created and invitation email sent.');

        return ['user' => $user, 'password' => $password, 'created' => true, 'error' => null];
    }

    public function proposalsFor(User $user)
    {
        return Proposal::query()
            ->whereIn('status', ['sent', 'accepted', 'declined'])
            ->where(function ($query) use ($user) {
                $query->where('client_email', $user->email);

                if ($user->lead_id) {
                    $query->orWhere('lead_id', $user->lead_id);
                }
            })
            ->latest()
            ->get();
    }

    public function invoicesFor(User $user)
    {
        return Invoice::query()
            ->whereIn('status', ['sent', 'paid', 'overdue'])
            ->where(function ($query) use ($user) {
                $query->where('client_email', $user->email);

                if ($user->lead_id) {
                    $query->orWhere('lead_id', $user->lead_id);
                }
            })
            ->latest()
            ->get();
    }

    public function ownsProposal(User $user, Proposal $proposal): bool
    {
        if ($proposal->client_email === $user->email) {
            return true;
        }

        return $user->lead_id && $proposal->lead_id === $user->lead_id;
    }

    public function ownsInvoice(User $user, Invoice $invoice): bool
    {
        if ($invoice->client_email === $user->email) {
            return true;
        }

        return $user->lead_id && $invoice->lead_id === $user->lead_id;
    }

    public function respondToProposal(User $user, Proposal $proposal, string $status): Proposal
    {
        abort_unless(in_array($status, ['accepted', 'declined'], true), 422);
        abort_unless($this->ownsProposal($user, $proposal), 403);
        abort_unless(in_array($proposal->status, ['sent', 'accepted', 'declined'], true), 422);

        $proposal->update(['status' => $status]);

        if ($proposal->lead_id) {
            $lead = Lead::find($proposal->lead_id);

            if ($lead) {
                $label = $status === 'accepted' ? 'accepted' : 'declined';
                $this->leads->addSystemNote($lead, "Client {$label} proposal {$proposal->number} via portal.");

                if ($status === 'accepted' && $lead->status !== 'won') {
                    $this->leads->updateStatus($lead, 'won');
                }
            }
        }

        return $proposal->refresh();
    }
}
