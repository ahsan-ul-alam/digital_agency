import { Link } from '../../app';
import PortalLayout from '../../Layouts/PortalLayout';
import { RiArrowRightLine, RiCalendarCheckLine, RiFileList3Line, RiReceiptLine, RiSparklingLine } from 'react-icons/ri';

function money(amount) {
    return `BDT ${Number(amount || 0).toLocaleString()}`;
}

function KpiCard({ label, value, href }) {
    const content = (
        <>
            <span>{label}</span>
            <strong>{value}</strong>
        </>
    );

    return href
        ? <Link href={href} className="portal-kpi">{content}<RiArrowRightLine /></Link>
        : <div className="portal-kpi">{content}</div>;
}

export default function Dashboard({ stats, upcomingMeetings, recentProposals, recentInvoices, user }) {
    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <PortalLayout title="Dashboard" subtitle="Your proposals, invoices and upcoming meetings.">
            <section className="portal-welcome">
                <div>
                    <p className="portal-eyebrow"><RiSparklingLine /> Client workspace</p>
                    <h2>Welcome back, {firstName}</h2>
                    <p>Review proposals, pay invoices and manage your meetings in one place.</p>
                </div>
                <Link href="/book" className="portal-welcome-cta">
                    <RiCalendarCheckLine /> Book a meeting
                </Link>
            </section>

            <div className="portal-kpi-grid">
                <KpiCard label="Proposals" value={stats.proposals} href="/portal/proposals" />
                <KpiCard label="Awaiting response" value={stats.pending_proposals} href="/portal/proposals" />
                <KpiCard label="Invoices" value={stats.invoices} href="/portal/invoices" />
                <KpiCard label="Outstanding" value={money(stats.outstanding)} href="/portal/invoices" />
            </div>

            <div className="portal-grid">
                <section className="portal-panel">
                    <div className="portal-panel-head">
                        <h2><RiFileList3Line /> Recent proposals</h2>
                        <Link href="/portal/proposals">View all</Link>
                    </div>
                    {recentProposals.length === 0 ? (
                        <div className="portal-empty">
                            <h3>No proposals yet</h3>
                            <p>Your agency will share proposals here when ready.</p>
                        </div>
                    ) : (
                        <ul className="portal-list">
                            {recentProposals.map((p) => (
                                <li key={p.id}>
                                    <Link href={`/portal/proposals/${p.id}`}>
                                        <strong>{p.number}</strong>
                                        <span>{p.title}</span>
                                        <em className={`portal-badge is-${p.status}`}>{p.status}</em>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="portal-panel">
                    <div className="portal-panel-head">
                        <h2><RiReceiptLine /> Recent invoices</h2>
                        <Link href="/portal/invoices">View all</Link>
                    </div>
                    {recentInvoices.length === 0 ? (
                        <div className="portal-empty">
                            <h3>No invoices yet</h3>
                            <p>Invoices appear here once billing begins.</p>
                        </div>
                    ) : (
                        <ul className="portal-list">
                            {recentInvoices.map((inv) => (
                                <li key={inv.id}>
                                    <Link href={`/portal/invoices/${inv.id}`}>
                                        <strong>{inv.invoice_number}</strong>
                                        <span>{money(inv.total)}</span>
                                        <em className={`portal-badge is-${inv.status}`}>{inv.status}</em>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="portal-panel portal-panel-wide">
                    <div className="portal-panel-head">
                        <h2><RiCalendarCheckLine /> Upcoming meetings</h2>
                        <Link href="/portal/meetings">View all</Link>
                    </div>
                    {upcomingMeetings.length === 0 ? (
                        <div className="portal-empty">
                            <h3>No upcoming meetings</h3>
                            <p><Link href="/book">Book a discovery call</Link> with our team.</p>
                        </div>
                    ) : (
                        <ul className="portal-list portal-list-horizontal">
                            {upcomingMeetings.map((b) => (
                                <li key={b.id}>
                                    <div className="portal-meeting-card">
                                        <strong>{b.meeting_type?.name}</strong>
                                        <span>{new Date(b.scheduled_at).toLocaleString()}</span>
                                        <em className={`portal-badge is-${b.status}`}>{b.status_label}</em>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </PortalLayout>
    );
}
