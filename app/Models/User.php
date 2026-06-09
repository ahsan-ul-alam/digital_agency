<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'account_type',
        'lead_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function isClient(): bool
    {
        return $this->account_type === 'client';
    }

    public function isAdmin(): bool
    {
        return $this->account_type !== 'client';
    }

    public function isSuperAdmin(): bool
    {
        return $this->role?->slug === 'super-admin';
    }

    public function hasPermission(string $slug): bool
    {
        if ($this->isClient()) {
            return false;
        }

        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($slug === 'leads.view' && ($this->role?->hasPermission('contacts.view') ?? false)) {
            return true;
        }

        return $this->role?->hasPermission($slug) ?? false;
    }

    public function permissionSlugs(): array
    {
        if ($this->isSuperAdmin()) {
            return collect(\App\Support\PermissionRegistry::definitions())->pluck('slug')->all();
        }

        return $this->role?->permissions()->pluck('slug')->all() ?? [];
    }
}

