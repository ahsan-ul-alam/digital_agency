<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\FormSubmission;
use App\Services\LeadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FormSubmissionController extends Controller
{
    public function store(Request $request, Form $form, LeadService $leads): RedirectResponse
    {
        abort_unless($form->is_active, 404);

        $rules = [];
        foreach ($form->fields as $field) {
            $rule = [($field['required'] ?? false) ? 'required' : 'nullable', 'string', 'max:5000'];
            if (($field['type'] ?? '') === 'email') {
                $rule = [($field['required'] ?? false) ? 'required' : 'nullable', 'email', 'max:255'];
            }
            $rules[$field['key']] = $rule;
        }

        $validated = $request->validate($rules);

        $submission = FormSubmission::create([
            'form_id' => $form->id,
            'data' => $validated,
            'page_url' => $request->headers->get('referer'),
        ]);

        $leads->recordFromForm($form, $validated, $request->headers->get('referer'), $submission->id);

        if (filled($form->redirect_url)) {
            return redirect($form->redirect_url)->with('success', $form->success_message);
        }

        return back()->with('success', $form->success_message);
    }
}
