import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/Admin/DataTable';
import EmptyState from '../../../Components/Admin/EmptyState';
import { Link, router } from '../../../app';
import { RiAddLine, RiFileList3Line } from 'react-icons/ri';

export default function ProposalsIndex({ proposals, stats }) {
    const rows = proposals.data.map((p) => ({
        ...p,
        client: p.client_name,
        amount: `BDT ${Number(p.total).toLocaleString()}`,
        status_label: p.status,
    }));

    return (
        <AdminLayout
            title="Proposals"
            subtitle="Create, send and track client proposals with PDF export."
            actions={<Link href="/admin/proposals/create" className="admin-topbar-primary"><RiAddLine /> New Proposal</Link>}
        >
            <div className="admin-crm-stats">
                <div className="admin-crm-stat"><strong>{stats.total}</strong><small>Total</small></div>
                <div className="admin-crm-stat"><strong>{stats.draft}</strong><small>Drafts</small></div>
                <div className="admin-crm-stat"><strong>{stats.sent}</strong><small>Sent</small></div>
            </div>

            <DataTable
                tableId="proposals"
                quickEditHref={(row) => `/admin/proposals/${row.id}/edit`}
                columns={['number', 'title', 'client', 'amount', 'status_label', 'created_at']}
                rows={rows}
                columnLabels={{ number: 'Number', title: 'Title', client: 'Client', amount: 'Total', status_label: 'Status', created_at: 'Created' }}
                exportFileName="proposals"
                renderCell={(row, col) => col === 'created_at' ? new Date(row.created_at).toLocaleDateString() : (row[col] ?? '—')}
                actions={(row) => (
                    <div className="admin-row-actions">
                        <Link href={`/admin/proposals/${row.id}/edit`} className="admin-row-action is-primary">Open</Link>
                        <a href={`/admin/proposals/${row.id}/pdf`} className="admin-row-action" target="_blank" rel="noreferrer">PDF</a>
                        <button type="button" className="admin-row-action is-danger" onClick={() => window.confirm('Delete proposal?') && router.delete(`/admin/proposals/${row.id}`)}>Delete</button>
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiFileList3Line}
                        title="No proposals yet"
                        body="Create a proposal from a lead or start fresh with line items and PDF export."
                        ctaHref="/admin/proposals/create"
                        ctaLabel="Create first proposal"
                    />
                )}
            />
        </AdminLayout>
    );
}
