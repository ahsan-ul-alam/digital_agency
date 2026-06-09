import AdminLayout from '../../Layouts/AdminLayout';
import EmptyState from '../../Components/Admin/EmptyState';
import { router } from '../../app';
import { RiNotification3Line } from 'react-icons/ri';

export default function NotificationsIndex({ notifications, unreadCount }) {
    function openNotification(id) {
        router.post(`/admin/notifications/${id}/read`);
    }

    function markAllRead() {
        router.post('/admin/notifications/read-all', { preserveScroll: true });
    }

    return (
        <AdminLayout
            title="Notifications"
            subtitle="Alerts for new leads and platform activity."
            actions={unreadCount > 0 ? (
                <button type="button" className="admin-topbar-btn" onClick={markAllRead}>
                    Mark all read
                </button>
            ) : null}
        >
            <div className="admin-notify-page">
                {notifications.data.length === 0 ? (
                    <EmptyState
                        icon={RiNotification3Line}
                        title="No notifications"
                        body="New lead alerts and platform events will appear here."
                    />
                ) : notifications.data.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`admin-notify-page-item${item.read_at ? ' is-read' : ''}`}
                        onClick={() => openNotification(item.id)}
                    >
                        <div>
                            <strong>{item.title}</strong>
                            {item.body && <p>{item.body}</p>}
                            <time>{new Date(item.created_at).toLocaleString()}</time>
                        </div>
                        {!item.read_at && <span className="admin-inquiry-dot" />}
                    </button>
                ))}
            </div>
        </AdminLayout>
    );
}
