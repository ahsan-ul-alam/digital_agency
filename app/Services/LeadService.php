<?php

namespace App\Services;

use App\Mail\NewLeadMail;
use App\Models\AdminNotification;
use App\Models\Form;
use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class LeadService
{
    public function recordFromContact(array $data, string $source = 'contact_page', ?int $contactSubmissionId = null): Lead
    {
        return $this->createLead([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'service' => $data['service'] ?? null,
            'budget' => $data['budget'] ?? null,
            'message' => $data['message'] ?? null,
            'source' => $source,
            'source_meta' => ['channel' => $source],
            'contact_submission_id' => $contactSubmissionId,
        ]);
    }

    public function recordFromCareer(array $data): Lead
    {
        return $this->createLead([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'service' => $data['role'] ?? null,
            'message' => $data['message'] ?? null,
            'source' => 'career_application',
            'source_meta' => $data['source_meta'] ?? [],
        ]);
    }

    public function recordFromQuote(array $data): Lead
    {
        return $this->createLead([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'service' => $data['service'] ?? null,
            'budget' => $data['budget'] ?? null,
            'message' => $data['message'] ?? null,
            'source' => 'quote_calculator',
            'source_meta' => $data['source_meta'] ?? [],
        ]);
    }

    public function recordFromForm(Form $form, array $data, ?string $pageUrl = null, ?int $formSubmissionId = null): Lead
    {
        $extracted = $this->extractFormIdentity($data, $form);

        return $this->createLead([
            'name' => $extracted['name'],
            'email' => $extracted['email'],
            'phone' => $extracted['phone'],
            'company' => $extracted['company'],
            'service' => $extracted['service'],
            'budget' => $extracted['budget'],
            'message' => $extracted['message'],
            'source' => 'custom_form',
            'source_meta' => [
                'form_id' => $form->id,
                'form_name' => $form->name,
                'form_shortcode' => $form->shortcode,
                'page_url' => $pageUrl,
                'fields' => $data,
            ],
            'form_submission_id' => $formSubmissionId,
        ]);
    }

    public function markRead(Lead $lead): Lead
    {
        if (! $lead->read_at) {
            $lead->update(['read_at' => now()]);
            $this->addSystemNote($lead, 'Lead opened and marked as read.');
        }

        return $lead->refresh();
    }

    public function updateStatus(Lead $lead, string $status, ?User $user = null): Lead
    {
        $previous = $lead->status;
        $lead->update(['status' => $status]);

        if ($previous !== $status) {
            $label = Lead::STATUS_LABELS[$status] ?? $status;
            $actor = $user?->name ?? 'System';
            $this->addSystemNote($lead, "Status changed to {$label} by {$actor}.", $user);
        }

        return $lead->refresh();
    }

    public function addNote(Lead $lead, string $body, ?User $user = null, bool $isSystem = false): LeadNote
    {
        return $lead->notes()->create([
            'user_id' => $user?->id,
            'body' => $body,
            'is_system' => $isSystem,
        ]);
    }

    private function createLead(array $attributes): Lead
    {
        $lead = Lead::create($attributes);

        $this->addSystemNote($lead, 'Lead created from '.$lead->source_label.'.');
        $this->notifyAdmins($lead);
        $this->emailAdmins($lead);

        return $lead;
    }

    public function addSystemNote(Lead $lead, string $body, ?User $user = null): LeadNote
    {
        return $this->addNote($lead, $body, $user, true);
    }

    private function notifyAdmins(Lead $lead): void
    {
        $recipients = $this->notifiableUsers();

        foreach ($recipients as $user) {
            AdminNotification::create([
                'user_id' => $user->id,
                'type' => 'new_lead',
                'title' => 'New lead: '.$lead->name,
                'body' => $lead->service ?: ($lead->message ? str($lead->message)->limit(120) : 'New inquiry received'),
                'href' => '/admin/leads/'.$lead->id,
                'data' => [
                    'lead_id' => $lead->id,
                    'source' => $lead->source,
                ],
            ]);
        }
    }

    private function emailAdmins(Lead $lead): void
    {
        $settings = SiteSetting::where('key', 'site')->first()?->value ?? [];
        $to = $settings['contact']['email'] ?? config('mail.from.address');

        if (! filled($to)) {
            return;
        }

        try {
            Mail::to($to)->send(new NewLeadMail($lead));
        } catch (\Throwable) {
            // Mail may be unconfigured in local dev (log driver).
        }
    }

    private function notifiableUsers()
    {
        return User::with('role.permissions')
            ->where('account_type', 'admin')
            ->get()
            ->filter(fn (User $user) => $user->hasPermission('leads.view') || $user->hasPermission('contacts.view'));
    }

    private function extractFormIdentity(array $data, Form $form): array
    {
        $fields = collect($form->fields ?? []);
        $lookup = collect($data);

        $find = function (array $keys) use ($lookup) {
            foreach ($keys as $key) {
                if ($lookup->has($key) && filled($lookup->get($key))) {
                    return $lookup->get($key);
                }
            }

            foreach ($lookup as $fieldKey => $value) {
                if (! filled($value)) {
                    continue;
                }

                foreach ($keys as $key) {
                    if (str_contains(strtolower((string) $fieldKey), $key)) {
                        return $value;
                    }
                }
            }

            return null;
        };

        $name = $find(['name', 'full_name', 'your_name']) ?? 'Unknown';
        $email = $find(['email', 'email_address']) ?? 'no-reply@arsoftbd.local';

        $message = $find(['message', 'details', 'description', 'requirements']);
        if (! $message) {
            $message = $fields
                ->map(fn ($field) => ($field['label'] ?? $field['key']).': '.($data[$field['key']] ?? '—'))
                ->join("\n");
        }

        return [
            'name' => $name,
            'email' => $email,
            'phone' => $find(['phone', 'mobile', 'contact']),
            'company' => $find(['company', 'organization', 'business']),
            'service' => $find(['service', 'project_type', 'type']),
            'budget' => $find(['budget', 'price', 'investment']),
            'message' => $message,
        ];
    }
}
