import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/Admin/DataTable';
import EmptyState from '../../Components/Admin/EmptyState';
import { Link, router } from '../../app';
import { RiArrowLeftLine, RiArrowRightLine, RiMailLine, RiMailUnreadLine } from 'react-icons/ri';

function bulkDelete(ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'inquiry' : 'inquiries'}?`)) {
        return;
    }

    router.delete('/admin/contacts/bulk', {
        data: { ids },
        preserveScroll: true,
        onSuccess: onDone,
    });
}

function messagePreview(message = '') {
    const text = String(message).replace(/\s+/g, ' ').trim();
    if (!text) return '—';
    return text.length > 72 ? `${text.slice(0, 72)}…` : text;
}

export default function ContactsIndex({ items, stats = {} }) {
    const rows = items.data.map((item) => ({
        ...item,
        status: item.read_at ? 'Read' : 'Unread',
        preview: messagePreview(item.message),
        received_at: item.created_at,
    }));

    return (
        <AdminLayout
            title="Leads & Inquiries"
            subtitle="Hero form and contact page submissions. Open an inquiry to read the full message."
        >
            <div className="admin-inquiry-stats">
                <div className="admin-inquiry-stat">
                    <span className="admin-inquiry-stat-icon"><RiMailLine /></span>
                    <span>
                        <strong>{stats.total ?? items.total}</strong>
                        <small>Total inquiries</small>
                    </span>
                </div>
                <div className={`admin-inquiry-stat${stats.unread ? ' is-alert' : ''}`}>
                    <span className="admin-inquiry-stat-icon"><RiMailUnreadLine /></span>
                    <span>
                        <strong>{stats.unread ?? 0}</strong>
                        <small>Unread</small>
                    </span>
                </div>
            </div>

            <div className="admin-page-meta">
                <p>
                    {items.total} {items.total === 1 ? 'inquiry' : 'inquiries'}
                    {items.last_page > 1 && ` · Page ${items.current_page} of ${items.last_page}`}
                </p>
            </div>

            <DataTable
                tableId="contacts"
                quickEditHref={(row) => `/admin/contacts/${row.id}`}
                columns={['status', 'name', 'email', 'service', 'preview', 'received_at']}
                rows={rows}
                columnLabels={{
                    status: 'Status',
                    name: 'From',
                    email: 'Email',
                    service: 'Service',
                    preview: 'Message',
                    received_at: 'Received',
                }}
                exportFileName="inquiries"
                onBulkDelete={bulkDelete}
                renderCell={(row, column) => {
                    if (column === 'status') {
                        return row.read_at
                            ? <span className="admin-inquiry-status is-read">Read</span>
                            : <span className="admin-inquiry-status is-unread">Unread</span>;
                    }
                    if (column === 'name') {
                        return (
                            <Link href={`/admin/contacts/${row.id}`} className="admin-inquiry-sender">
                                {!row.read_at && <span className="admin-inquiry-dot" aria-hidden />}
                                <span>{row.name}</span>
                            </Link>
                        );
                    }
                    if (column === 'preview') {
                        return (
                            <Link href={`/admin/contacts/${row.id}`} className="admin-inquiry-preview">
                                {row.preview}
                            </Link>
                        );
                    }
                    if (column === 'received_at') {
                        return new Date(row.received_at).toLocaleString();
                    }
                    return row[column] ?? '—';
                }}
                actions={(row) => (
                    <div className="admin-row-actions">
                        <Link href={`/admin/contacts/${row.id}`} className="admin-row-action is-primary">
                            Open
                        </Link>
                        <button
                            type="button"
                            className="admin-row-action is-danger"
                            onClick={() => window.confirm('Delete this inquiry?') && router.delete(`/admin/contacts/${row.id}`)}
                        >
                            Delete
                        </button>
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiMailLine}
                        title="No inquiries yet"
                        body="Submissions from the homepage hero form and contact page will appear here."
                    />
                )}
            />

            {items.last_page > 1 && (
                <div className="admin-pagination">
                    <p>Showing {items.from}–{items.to} of {items.total}</p>
                    <div className="admin-pagination-actions">
                        {items.prev_page_url && (
                            <Link href={items.prev_page_url} className="admin-pagination-btn">
                                <RiArrowLeftLine /> Previous
                            </Link>
                        )}
                        {items.next_page_url && (
                            <Link href={items.next_page_url} className="admin-pagination-btn">
                                Next <RiArrowRightLine />
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
