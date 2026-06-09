import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/Admin/DataTable';
import EmptyState from '../../../Components/Admin/EmptyState';
import { Link, router } from '../../../app';
import { RiAddLine, RiBillLine } from 'react-icons/ri';

export default function InvoicesIndex({ invoices, stats }) {
    const rows = invoices.data.map((inv) => ({
        ...inv,
        client: inv.client_name,
        amount: `BDT ${Number(inv.total).toLocaleString()}`,
        status_label: inv.status,
        due: inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—',
    }));

    return (
        <AdminLayout
            title="Invoices"
            subtitle="Generate invoices, track payment status, and export PDFs."
            actions={<Link href="/admin/invoices/create" className="admin-topbar-primary"><RiAddLine /> New Invoice</Link>}
        >
            <div className="admin-crm-stats">
                <div className="admin-crm-stat"><strong>{stats.total}</strong><small>Total</small></div>
                <div className="admin-crm-stat"><strong>{stats.paid}</strong><small>Paid</small></div>
                <div className="admin-crm-stat"><strong>BDT {Number(stats.outstanding).toLocaleString()}</strong><small>Outstanding</small></div>
            </div>

            <DataTable
                tableId="invoices"
                quickEditHref={(row) => `/admin/invoices/${row.id}/edit`}
                columns={['invoice_number', 'client', 'amount', 'status_label', 'due', 'created_at']}
                rows={rows}
                columnLabels={{ invoice_number: 'Invoice #', client: 'Client', amount: 'Total', status_label: 'Status', due: 'Due', created_at: 'Created' }}
                exportFileName="invoices"
                renderCell={(row, col) => col === 'created_at' ? new Date(row.created_at).toLocaleDateString() : (row[col] ?? '—')}
                actions={(row) => (
                    <div className="admin-row-actions">
                        <Link href={`/admin/invoices/${row.id}/edit`} className="admin-row-action is-primary">Open</Link>
                        <a href={`/admin/invoices/${row.id}/pdf`} className="admin-row-action" target="_blank" rel="noreferrer">PDF</a>
                        <button type="button" className="admin-row-action is-danger" onClick={() => window.confirm('Delete invoice?') && router.delete(`/admin/invoices/${row.id}`)}>Delete</button>
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiBillLine}
                        title="No invoices yet"
                        body="Create an invoice from a proposal or start a new bill manually."
                        ctaHref="/admin/invoices/create"
                        ctaLabel="Create first invoice"
                    />
                )}
            />
        </AdminLayout>
    );
}
