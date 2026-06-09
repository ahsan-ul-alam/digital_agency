import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/Admin/DataTable';
import EmptyState from '../../../Components/Admin/EmptyState';
import { Link, router } from '../../../app';
import { RiCalendarCheckLine } from 'react-icons/ri';

export default function BookingsIndex({ bookings, filters, stats, statuses }) {
    const rows = bookings.data.map((b) => ({
        ...b,
        type: b.meeting_type?.name,
        when: b.scheduled_at,
        status_label: b.status_label,
    }));

    return (
        <AdminLayout title="Meeting Bookings" subtitle="Review discovery calls and consultation requests.">
            <div className="admin-crm-stats">
                <div className="admin-crm-stat"><strong>{stats.total}</strong><small>Total</small></div>
                <div className="admin-crm-stat"><strong>{stats.pending}</strong><small>Pending</small></div>
                <div className="admin-crm-stat"><strong>{stats.upcoming}</strong><small>Upcoming</small></div>
            </div>

            <div className="admin-crm-filters">
                {[{ value: 'all', label: 'All' }, ...statuses].map((s) => (
                    <button
                        key={s.value}
                        type="button"
                        className={`admin-crm-filter ${filters.status === s.value ? 'is-active' : ''}`}
                        onClick={() => router.get('/admin/bookings', { status: s.value }, { preserveState: true })}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <DataTable
                tableId="bookings"
                quickEditHref={(row) => `/admin/bookings/${row.id}`}
                columns={['name', 'email', 'type', 'when', 'status_label']}
                rows={rows}
                columnLabels={{ name: 'Client', email: 'Email', type: 'Meeting', when: 'Scheduled', status_label: 'Status' }}
                exportFileName="bookings"
                renderCell={(row, col) => col === 'when' ? new Date(row.when).toLocaleString() : (row[col] ?? '—')}
                actions={(row) => (
                    <div className="admin-row-actions">
                        <Link href={`/admin/bookings/${row.id}`} className="admin-row-action is-primary">Open</Link>
                        {row.lead_id && <Link href={`/admin/leads/${row.lead_id}`} className="admin-row-action">Lead</Link>}
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiCalendarCheckLine}
                        title="No bookings yet"
                        body="Share the /book page on your site to start receiving meeting requests."
                    />
                )}
            />
        </AdminLayout>
    );
}
