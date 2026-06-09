<?php

namespace App\Http\Middleware;

use App\Support\PermissionRegistry;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPermission
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($user->isClient()) {
            abort(403, 'Client accounts cannot access the admin panel.');
        }

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $permission = PermissionRegistry::resolvePath($request->path());

        if ($permission && ! $user->hasPermission($permission)) {
            abort(403, 'You do not have permission to access this area.');
        }

        return $next($request);
    }
}
