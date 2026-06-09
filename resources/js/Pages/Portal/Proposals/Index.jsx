import { useMemo, useState } from 'react';
import { Link } from '../../../app';
import PortalLayout from '../../../Layouts/PortalLayout';
import { RiArrowRightLine, RiFileList3Line } from 'react-icons/ri';

function money(amount) {
    return `BDT ${Number(amount || 0).toLocaleString()}`;
}

export default function ProposalsIndex({ proposals }) {
    const [filter, setFilter] = useState('all');

    const stats = useMemo(() => ({
        total: proposals.length,
        pending: proposals.filter((p) => p.status === 'sent').length,
        accepted: proposals.filter((p) => p.status === 'accepted').length,
    }), [proposals]);

    const filtered = useMemo(() => {
        if (filter === 'all') return proposals;
        return proposals.filter((p) => p.status === filter);
    }, [proposals, filter]);

    return (
        <PortalLayout title="Proposals" subtitle="Review and respond to project proposals.">
            <div className="portal-kpi-grid portal-kpi-grid-3">
                <div className="portal-kpi"><span>Total</span><strong>{stats.total}</strong></div>
                <div className="portal-kpi"><span>Awaiting response</span><strong>{stats.pending}</strong></div>
                <div className="portal-kpi"><span>Accepted</span><strong>{stats.accepted}</strong></div>
            </div>

            {proposals.length > 0 && (
                <div className="portal-filter-row">
                    {[
                        ['all', 'All'],
                        ['sent', 'Awaiting'],
                        ['accepted', 'Accepted'],
                        ['declined', 'Declined'],
                        ['draft', 'Draft'],
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
                    <RiFileList3Line className="portal-empty-icon" />
                    <h3>{proposals.length === 0 ? 'No proposals yet' : 'No proposals match this filter'}</h3>
                    <p>{proposals.length === 0 ? 'When we send a proposal, it will appear here for your review.' : 'Try a different filter above.'}</p>
                </div>
            ) : (
                <div className="portal-cards portal-cards-rich">
                    {filtered.map((p) => (
                        <Link key={p.id} href={`/portal/proposals/${p.id}`} className="portal-card portal-card-rich">
                            <div className="portal-card-icon"><RiFileList3Line /></div>
                            <div className="portal-card-body">
                                <strong>{p.number}</strong>
                                <h3>{p.title}</h3>
                                <p>{money(p.total)} · Valid until {p.valid_until ? new Date(p.valid_until).toLocaleDateString() : '—'}</p>
                            </div>
                            <div className="portal-card-meta">
                                <span className={`portal-badge is-${p.status}`}>{p.status}</span>
                                <RiArrowRightLine />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
