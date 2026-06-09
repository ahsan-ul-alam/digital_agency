<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $action = $request->string('action')->trim();

        $query = AuditLog::with('user')->latest();

        if ($action->isNotEmpty() && $action !== 'all') {
            $query->where('action', $action);
        }

        $actions = AuditLog::query()
            ->select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $query->paginate(30)->withQueryString(),
            'filters' => ['action' => $action->isNotEmpty() ? $action->toString() : 'all'],
            'actions' => $actions,
            'stats' => [
                'total' => AuditLog::count(),
                'today' => AuditLog::whereDate('created_at', today())->count(),
            ],
        ]);
    }
}
