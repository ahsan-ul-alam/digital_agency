import { useMemo, useState } from 'react';
import { Link } from '../../../app';
import PortalLayout from '../../../Layouts/PortalLayout';
import { RiArrowRightLine, RiReceiptLine } from 'react-icons/ri';

function money(amount) {
    return `BDT ${Number(amount || 0).toLocaleString()}`;
}

export default function InvoicesIndex({ invoices }) {
    const [filter, setFilter] = useState('all');

    const stats = useMemo(() => ({
        total: invoices.length,
        outstanding: invoices.filter((inv) => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + Number(inv.total || 0), 0),
        paid: invoices.filter((inv) => inv.status === 'paid').length,
    }), [invoices]);

    const filtered = useMemo(() => {
        if (filter === 'all') return invoices;
        if (filter === 'due') return invoices.filter((inv) => ['sent', 'overdue'].includes(inv.status));
        return invoices.filter((inv) => inv.status === filter);
    }, [invoices, filter]);

    return (
        <PortalLayout title="Invoices" subtitle="View billing history and payment status.">
            <div className="portal-kpi-grid">
                <div className="portal-kpi"><span>Total invoices</span><strong>{stats.total}</strong></div>
                <div className="portal-kpi"><span>Outstanding</span><strong>{money(stats.outstanding)}</strong></div>
                <div className="portal-kpi"><span>Paid</span><strong>{stats.paid}</strong></div>
            </div>

            {invoices.length > 0 && (
                <div className="portal-filter-row">
                    {[
                        ['all', 'All'],
                        ['due', 'Due'],
                        ['paid', 'Paid'],
                        ['sent', 'Sent'],
                        ['overdue', 'Overdue'],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={`portal-filter-pill ${filter === value ? 'is-active' : ''}`}
                            onClick={() => setFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="portal-empty">
                    <RiReceiptLine className="portal-empty-icon" />
                    <h3>{invoices.length === 0 ? 'No invoices yet' : 'No invoices match this filter'}</h3>
                    <p>{invoices.length === 0 ? 'Invoices will appear here once a project is billed.' : 'Try a different filter above.'}</p>
                </div>
            ) : (
                <div className="portal-cards portal-cards-rich">
                    {filtered.map((inv) => (
                        <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="portal-card portal-card-rich">
                            <div className="portal-card-icon"><RiReceiptLine /></div>
                            <div className="portal-card-body">
                                <strong>{inv.invoice_number}</strong>
                                <h3>{money(inv.total)}</h3>
                                <p>Due {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'on receipt'}</p>
                            </div>
                            <div className="portal-card-meta">
                                <span className={`portal-badge is-${inv.status}`}>{inv.status}</span>
                                <RiArrowRightLine />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
