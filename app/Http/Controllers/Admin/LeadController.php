<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadFollowup;
use App\Models\User;
use App\Services\AuditLogger;
use App\Services\ClientPortalService;
use App\Services\LeadService;
use App\Services\UserPasswordService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->trim();

        $query = Lead::query()->latest();

        if ($status->isNotEmpty() && $status !== 'all' && in_array($status->toString(), Lead::STATUSES, true)) {
            $query->where('status', $status->toString());
        }

        $statusCounts = collect(Lead::STATUSES)
            ->mapWithKeys(fn (string $value) => [$value => Lead::where('status', $value)->count()])
            ->all();

        return Inertia::render('Admin/LeadsIndex', [
            'items' => $query->paginate(20)->withQueryString(),
            'filters' => ['status' => $status->isNotEmpty() ? $status->toString() : 'all'],
            'stats' => [
                'total' => Lead::count(),
                'unread' => Lead::whereNull('read_at')->count(),
                'new' => $statusCounts['new'] ?? 0,
                'by_status' => $statusCounts,
            ],
            'statuses' => collect(Lead::STATUS_LABELS)->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])->values(),
        ]);
    }

    public function show(Lead $lead, LeadService $leads): Response
    {
        $leads->markRead($lead);

        $lead->load([
            'notes.user',
            'followups.user',
            'assignee',
            'clientUser',
        ]);

        return Inertia::render('Admin/LeadShow', [
            'lead' => $lead,
            'statuses' => collect(Lead::STATUS_LABELS)->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])->values(),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'timeline' => $this->timeline($lead),
        ]);
    }

    public function update(Request $request, Lead $lead, LeadService $leads, AuditLogger $audit): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['nullable', 'in:'.implode(',', Lead::STATUSES)],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        if (isset($data['status'])) {
            $leads->updateStatus($lead, $data['status'], $request->user());
            $audit->log('lead.status_updated', $lead, $lead->name, ['status' => $data['status']]);
        }

        if (array_key_exists('assigned_to', $data)) {
            $lead->update(['assigned_to' => $data['assigned_to']]);
            $audit->log('lead.assigned', $lead, $lead->name, ['assigned_to' => $data['assigned_to']]);
        }

        return back()->with('success', 'Lead updated.');
    }

    public function storeNote(Request $request, Lead $lead, LeadService $leads): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $leads->addNote($lead, $data['body'], $request->user());

        return back()->with('success', 'Note added.');
    }

    public function storeFollowup(Request $request, Lead $lead): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'due_at' => ['required', 'date'],
        ]);

        $lead->followups()->create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'notes' => $data['notes'] ?? null,
            'due_at' => $data['due_at'],
        ]);

        return back()->with('success', 'Follow-up scheduled.');
    }

    public function completeFollowup(Lead $lead, LeadFollowup $followup): RedirectResponse
    {
        abort_unless($followup->lead_id === $lead->id, 404);

        $followup->update(['completed_at' => now()]);

        return back()->with('success', 'Follow-up completed.');
    }

    public function invitePortal(Lead $lead, ClientPortalService $portal, AuditLogger $audit): RedirectResponse
    {
        $result = $portal->invite($lead);

        if (! $result['error']) {
            $audit->log('lead.portal_invited', $lead, $lead->name);
        }

        if ($result['error']) {
            return back()->with('error', $result['error']);
        }

        if ($result['created'] && $result['password']) {
            return back()->with('success', 'Client portal invite sent. Temporary password: '.$result['password']);
        }

        return back()->with('success', 'Client already has portal access.');
    }

    public function regeneratePortalPassword(Lead $lead, UserPasswordService $passwords, AuditLogger $audit): RedirectResponse
    {
        $lead->load('clientUser');
        $client = $lead->clientUser;

        if (! $client) {
            return back()->with('error', 'This lead does not have a client portal account yet.');
        }

        $plain = $passwords->regenerate($client);

        $audit->log('lead.portal_password_regenerated', $lead, $lead->name, [
            'client_email' => $client->email,
        ]);

        return back()->with('success', "New portal password for {$client->email}: {$plain}");
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        return redirect()->route('admin.leads.index')->with('success', 'Lead deleted.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $deleted = Lead::whereIn('id', $ids)->delete();

        return back()->with('success', $deleted.' lead(s) deleted.');
    }

    private function timeline(Lead $lead): array
    {
        $events = collect([
            [
                'type' => 'created',
                'title' => 'Lead created',
                'meta' => $lead->source_label,
                'time' => $lead->created_at,
            ],
        ]);

        if ($lead->read_at) {
            $events->push([
                'type' => 'read',
                'title' => 'Marked as read',
                'meta' => null,
                'time' => $lead->read_at,
            ]);
        }

        foreach ($lead->notes as $note) {
            $events->push([
                'type' => $note->is_system ? 'system' : 'note',
                'title' => $note->is_system ? 'Activity' : 'Note added',
                'meta' => $note->body,
                'actor' => $note->user?->name,
                'time' => $note->created_at,
            ]);
        }

        foreach ($lead->followups as $followup) {
            $events->push([
                'type' => 'followup',
                'title' => $followup->completed_at ? 'Follow-up completed' : 'Follow-up scheduled',
                'meta' => $followup->title.($followup->notes ? ' — '.$followup->notes : ''),
                'actor' => $followup->user?->name,
                'time' => $followup->completed_at ?? $followup->created_at,
            ]);
        }

        return $events->sortByDesc('time')->values()->map(fn ($event) => [
            ...$event,
            'time' => $event['time']?->toIso8601String(),
        ])->all();
    }
}
