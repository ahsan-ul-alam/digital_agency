<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    public function log(string $action, ?Model $subject = null, ?string $label = null, array $properties = [], ?int $userId = null): AuditLog
    {
        return AuditLog::create([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'subject_type' => $subject ? $subject->getMorphClass() : null,
            'subject_id' => $subject?->getKey(),
            'subject_label' => $label ?? $this->defaultLabel($subject),
            'properties' => $properties ?: null,
            'ip_address' => Request::ip(),
        ]);
    }

    private function defaultLabel(?Model $subject): ?string
    {
        if (! $subject) {
            return null;
        }

        foreach (['name', 'title', 'number', 'invoice_number', 'email'] as $field) {
            if (filled($subject->{$field} ?? null)) {
                return (string) $subject->{$field};
            }
        }

        return class_basename($subject).' #'.$subject->getKey();
    }
}
