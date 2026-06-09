import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/Admin/DataTable';
import EmptyState from '../../Components/Admin/EmptyState';
import { Link, router } from '../../app';
import { RiArrowLeftLine, RiArrowRightLine, RiUserStarLine } from 'react-icons/ri';

const STATUS_CLASS = {
    new: 'is-new',
    contacted: 'is-contacted',
    qualified: 'is-qualified',
    proposal_sent: 'is-proposal',
    won: 'is-won',
    lost: 'is-lost',
};

function bulkDelete(ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'lead' : 'leads'}?`)) {
        return;
    }

    router.delete('/admin/leads/bulk', {
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

export default function LeadsIndex({ items, filters = {}, stats = {}, statuses = [] }) {
    const activeStatus = filters.status || 'all';

    const rows = items.data.map((item) => ({
        ...item,
        preview: messagePreview(item.message),
        status_label: statuses.find((s) => s.value === item.status)?.label || item.status,
    }));

    function setStatus(status) {
        router.get('/admin/leads', status === 'all' ? {} : { status }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AdminLayout
            title="CRM Leads"
            subtitle="Unified pipeline for contact forms, homepage inquiries, and custom form submissions."
        >
            <div className="admin-crm-stats">
                <div className="admin-crm-stat">
                    <strong>{stats.total ?? items.total}</strong>
                    <small>Total leads</small>
                </div>
                <div className={`admin-crm-stat${stats.unread ? ' is-alert' : ''}`}>
                    <strong>{stats.unread ?? 0}</strong>
                    <small>Unread</small>
                </div>
                <div className="admin-crm-stat">
                    <strong>{stats.new ?? 0}</strong>
                    <small>New</small>
                </div>
            </div>

            <div className="admin-crm-pipeline">
                <button
                    type="button"
                    className={`admin-crm-pill${activeStatus === 'all' ? ' is-active' : ''}`}
                    onClick={() => setStatus('all')}
                >
                    All
                </button>
                {statuses.map((status) => (
                    <button
                        key={status.value}
                        type="button"
                        className={`admin-crm-pill ${STATUS_CLASS[status.value] || ''}${activeStatus === status.value ? ' is-active' : ''}`}
                        onClick={() => setStatus(status.value)}
                    >
                        {status.label}
                        <span>{stats.by_status?.[status.value] ?? 0}</span>
                    </button>
                ))}
            </div>

            <DataTable
                tableId="leads"
                quickEditHref={(row) => `/admin/leads/${row.id}`}
                columns={['status_label', 'name', 'email', 'service', 'preview', 'created_at']}
                rows={rows}
                columnLabels={{
                    status_label: 'Stage',
                    name: 'Lead',
                    email: 'Email',
                    service: 'Service',
                    preview: 'Message',
                    created_at: 'Received',
                }}
                exportFileName="leads"
                onBulkDelete={bulkDelete}
                renderCell={(row, column) => {
                    if (column === 'status_label') {
                        return (
                            <span className={`admin-crm-badge ${STATUS_CLASS[row.status] || ''}`}>
                                {row.status_label}
                            </span>
                        );
                    }
                    if (column === 'name') {
                        return (
                            <Link href={`/admin/leads/${row.id}`} className="admin-inquiry-sender">
                                {!row.read_at && <span className="admin-inquiry-dot" aria-hidden />}
                                <span>{row.name}</span>
                            </Link>
                        );
                    }
                    if (column === 'preview') {
                        return (
                            <Link href={`/admin/leads/${row.id}`} className="admin-inquiry-preview">
                                {row.preview}
                            </Link>
                        );
                    }
                    if (column === 'created_at') {
                        return new Date(row.created_at).toLocaleString();
                    }
                    return row[column] ?? '—';
                }}
                actions={(row) => (
                    <div className="admin-row-actions">
                        <Link href={`/admin/leads/${row.id}`} className="admin-row-action is-primary">Open</Link>
                        <button
                            type="button"
                            className="admin-row-action is-danger"
                            onClick={() => window.confirm('Delete this lead?') && router.delete(`/admin/leads/${row.id}`)}
                        >
                            Delete
                        </button>
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiUserStarLine}
                        title="No leads in this stage"
                        body="Submissions from your website forms will appear here automatically."
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
