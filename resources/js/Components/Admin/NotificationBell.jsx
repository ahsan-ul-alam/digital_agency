import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, router, usePage } from '../../app';
import { RiNotification3Line } from 'react-icons/ri';

export default function NotificationBell() {
    const { notificationUnread = 0 } = usePage().props;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(notificationUnread);
    const panelRef = useRef(null);

    useEffect(() => {
        setCount(notificationUnread);
    }, [notificationUnread]);

    useEffect(() => {
        if (!open) return;

        axios.get('/admin/notifications/feed').then((response) => {
            setItems(response.data.items || []);
            setCount(response.data.unread_count || 0);
        });
    }, [open]);

    useEffect(() => {
        function onClick(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    function openNotification(item) {
        setOpen(false);
        router.post(`/admin/notifications/${item.id}/read`);
    }

    function markAllRead() {
        router.post('/admin/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setCount(0);
                setItems((current) => current.map((item) => ({ ...item, read_at: new Date().toISOString() })));
            },
        });
    }

    return (
        <div className="admin-notify" ref={panelRef}>
            <button
                type="button"
                className="admin-notify-btn"
                onClick={() => setOpen((value) => !value)}
                aria-label="Notifications"
            >
                <RiNotification3Line />
                {count > 0 && <span className="admin-notify-badge">{count > 9 ? '9+' : count}</span>}
            </button>

            {open && (
                <div className="admin-notify-panel">
                    <div className="admin-notify-head">
                        <strong>Notifications</strong>
                        {count > 0 && (
                            <button type="button" onClick={markAllRead}>Mark all read</button>
                        )}
                    </div>
                    <div className="admin-notify-list">
                        {items.length === 0 ? (
                            <p className="admin-notify-empty">No notifications yet.</p>
                        ) : items.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`admin-notify-item${item.read_at ? ' is-read' : ''}`}
                                onClick={() => openNotification(item)}
                            >
                                <strong>{item.title}</strong>
                                {item.body && <p>{item.body}</p>}
                                <time>{new Date(item.created_at).toLocaleString()}</time>
                            </button>
                        ))}
                    </div>
                    <Link href="/admin/notifications" className="admin-notify-footer" onClick={() => setOpen(false)}>
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
}
