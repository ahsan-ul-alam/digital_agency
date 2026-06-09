<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\FormSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FormBuilderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/FormIndex', [
            'forms' => Form::withCount('submissions')->orderByDesc('id')->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/FormBuilder', [
            'form' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $form = Form::create($this->validated($request));

        return redirect()->route('admin.forms.edit', $form)->with('success', 'Form created.');
    }

    public function edit(Form $form): Response
    {
        return Inertia::render('Admin/FormBuilder', [
            'form' => $form,
        ]);
    }

    public function update(Request $request, Form $form): RedirectResponse
    {
        $form->update($this->validated($request, $form));

        return back()->with('success', 'Form updated.');
    }

    public function destroy(Form $form): RedirectResponse
    {
        $form->delete();

        return redirect()->route('admin.forms.index')->with('success', 'Form deleted.');
    }

    public function submissions(Form $form): Response
    {
        return Inertia::render('Admin/FormSubmissions', [
            'form' => $form->only('id', 'name', 'shortcode'),
            'submissions' => $form->submissions()->latest()->paginate(30),
        ]);
    }

    public function markRead(FormSubmission $submission): RedirectResponse
    {
        $submission->update(['read_at' => now()]);

        return back()->with('success', 'Submission marked as read.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $deleted = Form::whereIn('id', $ids)->delete();

        return back()->with('success', $deleted.' form(s) deleted.');
    }

    public function bulkDestroySubmissions(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $deleted = FormSubmission::whereIn('id', $ids)->delete();

        return back()->with('success', $deleted.' response(s) deleted.');
    }

    private function validated(Request $request, ?Form $form = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'shortcode' => ['nullable', 'string', 'max:80'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*.key' => ['required', 'string', 'max:80'],
            'fields.*.label' => ['required', 'string', 'max:160'],
            'fields.*.type' => ['required', 'string', 'in:text,email,phone,textarea,select,number'],
            'fields.*.required' => ['boolean'],
            'fields.*.options' => ['nullable', 'string'],
            'submit_label' => ['nullable', 'string', 'max:80'],
            'success_message' => ['nullable', 'string', 'max:500'],
            'redirect_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $shortcode = filled($data['shortcode'] ?? null)
            ? Str::slug($data['shortcode'])
            : Str::slug($data['name']);

        if (Form::where('shortcode', $shortcode)->when($form, fn ($query) => $query->where('id', '!=', $form->id))->exists()) {
            $shortcode .= '-'.Str::random(4);
        }

        return [
            'name' => $data['name'],
            'shortcode' => $shortcode,
            'fields' => collect($data['fields'])->map(fn ($field) => [
                'key' => Str::slug($field['key'], '_'),
                'label' => $field['label'],
                'type' => $field['type'],
                'required' => (bool) ($field['required'] ?? false),
                'options' => filled($field['options'] ?? null)
                    ? array_values(array_filter(array_map('trim', explode("\n", $field['options']))))
                    : [],
            ])->values()->all(),
            'submit_label' => $data['submit_label'] ?? 'Submit',
            'success_message' => $data['success_message'] ?? 'Thank you. We received your submission.',
            'redirect_url' => $data['redirect_url'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
        ];
    }
}
