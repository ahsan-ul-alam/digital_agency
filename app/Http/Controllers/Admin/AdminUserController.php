<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditLogger;
use App\Services\UserPasswordService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Users/Index', [
            'authUserId' => auth()->id(),
            'users' => User::with('role')->orderBy('name')->get()->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'account_type' => $user->account_type ?? 'admin',
                'role' => $user->role?->only('id', 'name', 'slug'),
                'created_at' => $user->created_at?->toDateTimeString(),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => null,
            'roles' => Role::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        User::create($data);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => $user->load('role'),
            'roles' => Role::orderBy('name')->get(['id', 'name', 'slug']),
            'authUserId' => auth()->id(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $this->validated($request, $user);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $ids = collect($ids)->reject(fn ($id) => (int) $id === auth()->id())->values()->all();

        if (! $ids) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $deleted = User::whereIn('id', $ids)->delete();

        return back()->with('success', $deleted.' user(s) deleted.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted.');
    }

    public function regeneratePassword(User $user, UserPasswordService $passwords, AuditLogger $audit): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot regenerate your own password here. Set a new password on the edit form instead.');
        }

        $plain = $passwords->regenerate($user);

        $audit->log('user.password_regenerated', $user, $user->email, [
            'account_type' => $user->account_type ?? 'admin',
        ]);

        return back()->with('success', "New password for {$user->email}: {$plain}");
    }

    private function validated(Request $request, ?User $user = null): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', Rule::unique('users', 'email')->ignore($user?->id)],
            'role_id' => ['required', 'exists:roles,id'],
        ];

        if ($user) {
            $rules['password'] = ['nullable', 'string', 'min:8', 'confirmed'];
        } else {
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        }

        return $request->validate($rules);
    }
}
