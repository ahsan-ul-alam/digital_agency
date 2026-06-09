import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/Admin/DataTable';
import EmptyState from '../../../Components/Admin/EmptyState';
import { router } from '../../../app';
import { RiHistoryLine } from 'react-icons/ri';

function formatAction(action) {
    return action.replace(/\./g, ' · ').replace(/_/g, ' ');
}

export default function AuditLogsIndex({ logs, filters, actions, stats }) {
    const rows = logs.data.map((log) => ({
        ...log,
        actor: log.user?.name || 'System',
        action_label: formatAction(log.action),
        when: log.created_at,
    }));

    return (
        <AdminLayout title="Audit Log" subtitle="Track admin activity across CRM, sales, invoices and settings.">
            <div className="admin-crm-stats">
                <div className="admin-crm-stat"><strong>{stats.total}</strong><small>Total events</small></div>
                <div className="admin-crm-stat"><strong>{stats.today}</strong><small>Today</small></div>
            </div>

            <div className="admin-crm-filters">
                <button
                    type="button"
                    className={`admin-crm-filter ${filters.action === 'all' ? 'is-active' : ''}`}
                    onClick={() => router.get('/admin/audit-logs', { action: 'all' }, { preserveState: true })}
                >
                    All
                </button>
                {actions.map((action) => (
                    <button
                        key={action}
                        type="button"
                        className={`admin-crm-filter ${filters.action === action ? 'is-active' : ''}`}
                        onClick={() => router.get('/admin/audit-logs', { action }, { preserveState: true })}
                    >
                        {formatAction(action)}
                    </button>
                ))}
            </div>

            <DataTable
                tableId="audit-logs"
                columns={['action_label', 'subject_label', 'actor', 'when']}
                rows={rows}
                columnLabels={{ action_label: 'Action', subject_label: 'Subject', actor: 'User', when: 'When' }}
                exportFileName="audit-log"
                renderCell={(row, col) => col === 'when' ? new Date(row.when).toLocaleString() : (row[col] ?? '—')}
                emptyState={(
                    <EmptyState
                        icon={RiHistoryLine}
                        title="No audit events yet"
                        body="Admin actions will appear here as your team works in the platform."
                    />
                )}
            />
        </AdminLayout>
    );
}
