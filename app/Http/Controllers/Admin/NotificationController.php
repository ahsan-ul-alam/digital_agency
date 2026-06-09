<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = AdminNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/NotificationsIndex', [
            'notifications' => $notifications,
            'unreadCount' => AdminNotification::where('user_id', $request->user()->id)->whereNull('read_at')->count(),
        ]);
    }

    public function feed(Request $request)
    {
        $items = AdminNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->take(12)
            ->get()
            ->map(fn (AdminNotification $notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'body' => $notification->body,
                'href' => $notification->href,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ]);

        return response()->json([
            'items' => $items,
            'unread_count' => AdminNotification::where('user_id', $request->user()->id)->whereNull('read_at')->count(),
        ]);
    }

    public function markRead(AdminNotification $notification, Request $request): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['read_at' => now()]);

        if ($notification->href) {
            return redirect($notification->href);
        }

        return back();
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        AdminNotification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }
}
