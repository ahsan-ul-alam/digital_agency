import AdminLayout from '../../Layouts/AdminLayout';
import KpiCard from '../../Components/Admin/KpiCard';
import { Link } from '../../app';
import { NavIcon } from '../../Admin/icons';
import {
    RiArrowRightLine,
    RiCheckLine,
    RiCircleLine,
    RiPulseLine,
    RiSparklingLine,
} from 'react-icons/ri';

function TrendChart({ title, subtitle, series }) {
    const max = Math.max(...series.map((row) => row.value), 1);

    return (
        <div className="dash-trend-card">
            <div className="dash-section-head">
                <div>
                    <h3>{title}</h3>
                    {subtitle && <p>{subtitle}</p>}
                </div>
            </div>
            <div className="dash-trend-bars">
                {series.map((row) => (
                    <div key={row.label} className="dash-trend-bar" title={`${row.label}: ${row.value}`}>
                        <span style={{ height: `${Math.max(8, (row.value / max) * 100)}%` }} />
                        <small>{row.label}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HealthPill({ item }) {
    return (
        <Link href={item.href} className={`dash-health-pill is-${item.status}`}>
            <span className="dash-health-dot" />
            <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
            </span>
        </Link>
    );
}

function QuickActionCard({ action }) {
    return (
        <Link href={action.href} className={`dash-quick-card ${action.tone === 'primary' ? 'is-primary' : ''} ${action.tone === 'alert' ? 'is-alert' : ''}`}>
            <span className="dash-quick-icon"><NavIcon name={action.icon} /></span>
            <span>
                <strong>{action.label}</strong>
                <small>{action.description}</small>
            </span>
            <RiArrowRightLine />
        </Link>
    );
}

function money(value) {
    return `BDT ${Number(value || 0).toLocaleString()}`;
}

export default function Dashboard({
    greeting,
    summary,
    kpis = [],
    health,
    quickActions,
    setup,
    latestContacts,
    popularContent,
    pendingTasks,
    trends = {},
    topPages = [],
}) {
    const setupDone = setup.filter((item) => item.done).length;

    return (
        <AdminLayout title="Dashboard" subtitle="Welcome back. Here is how your agency platform is performing today.">
            <section className="dash-welcome">
                <div className="dash-welcome-copy">
                    <p className="dash-eyebrow"><RiSparklingLine /> Workspace</p>
                    <h2>{greeting}</h2>
                    <p>Manage content, leads, sales and website health from one premium command center.</p>
                    {pendingTasks.length > 0 && (
                        <div className="dash-task-chips">
                            {pendingTasks.map((task) => (
                                <Link key={task.label} href={task.href} className="dash-task-chip">
                                    <RiPulseLine /> {task.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <div className="dash-welcome-stats">
                    {[
                        ['Unread Leads', summary.unreadLeads, '/admin/leads'],
                        ['Published Posts', summary.publishedPosts, '/admin/blog'],
                        ['Active Services', summary.activeServices, '/admin/services'],
                        ['Media Files', summary.mediaFiles, '/admin/media'],
                    ].map(([label, value, href]) => (
                        <Link key={label} href={href} className="dash-mini-stat">
                            <span>{label}</span>
                            <strong>{value}</strong>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="dash-kpi-grid">
                {kpis.map((kpi) => (
                    <KpiCard
                        key={kpi.label}
                        label={kpi.label}
                        value={kpi.value}
                        change={kpi.change}
                        href={kpi.href}
                        series={kpi.series}
                        formatValue={kpi.format === 'currency' ? money : undefined}
                    />
                ))}
            </section>

            <div className="dash-grid-2">
                <section className="dash-panel">
                    <div className="dash-section-head">
                        <h3>Quick Actions</h3>
                        <p>Jump into the workflows you use most.</p>
                    </div>
                    <div className="dash-quick-grid">
                        {quickActions.map((action) => <QuickActionCard key={action.label} action={action} />)}
                    </div>
                </section>

                <section className="dash-panel">
                    <div className="dash-section-head">
                        <h3>Website Health</h3>
                        <p>Core systems that power your public site.</p>
                    </div>
                    <div className="dash-health-grid">
                        {health.map((item) => <HealthPill key={item.label} item={item} />)}
                    </div>
                </section>
            </div>

            <div className="dash-grid-2 dash-grid-wide">
                <TrendChart title="Traffic" subtitle="Page views over the last 14 days" series={trends.pageViews || []} />
                <TrendChart title="Lead pipeline" subtitle="New leads over the last 14 days" series={trends.leads || []} />
            </div>

            <div className="dash-grid-2">
                <section className="dash-panel">
                    <div className="dash-section-head">
                        <h3>Lead Inbox</h3>
                        <Link href="/admin/leads" className="dash-inline-link">View all</Link>
                    </div>
                    {latestContacts.length === 0 ? (
                        <div className="dash-empty">
                            <h4>No leads yet</h4>
                            <p>Hero forms, quotes and contact pages will populate this inbox.</p>
                        </div>
                    ) : (
                        <div className="dash-inbox">
                            {latestContacts.map((item) => (
                                <Link key={item.id} href={`/admin/leads/${item.id}`} className="dash-inbox-item">
                                    <span>
                                        <strong>{item.name}</strong>
                                        <small>{item.email}</small>
                                    </span>
                                    {!item.read_at && <span className="dash-badge">New</span>}
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dash-panel">
                    <div className="dash-section-head">
                        <h3>Popular Content</h3>
                        <p>Highlighted packages, portfolio and blog.</p>
                    </div>
                    <div className="dash-popular-grid">
                        {popularContent.map((block) => (
                            <Link key={block.label} href={block.href} className="dash-popular-card">
                                <strong>{block.label}</strong>
                                {block.value.length === 0 ? (
                                    <p>Nothing featured yet</p>
                                ) : (
                                    <ul>{block.value.map((entry) => <li key={entry}>{entry}</li>)}</ul>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <div className="dash-grid-2">
                <section className="dash-panel">
                    <div className="dash-section-head">
                        <h3>Top Pages</h3>
                        <p>Most visited URLs in the last 30 days.</p>
                    </div>
                    {topPages.length === 0 ? (
                        <div className="dash-empty compact">Browse the public site to start collecting analytics.</div>
                    ) : (
                        <div className="dash-top-pages">
                            {topPages.map((row) => (
                                <div key={row.path} className="dash-top-page-row">
                                    <span>{row.path || '/'}</span>
                                    <strong>{row.views}</strong>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dash-panel">
                    <div className="dash-section-head">
                        <h3>Setup Progress</h3>
                        <span className="dash-setup-count">{setupDone}/{setup.length}</span>
                    </div>
                    <div className="dash-setup-bar"><span style={{ width: `${(setupDone / setup.length) * 100}%` }} /></div>
                    <div className="dash-setup-list">
                        {setup.map((item) => (
                            <Link key={item.label} href={item.href} className="dash-setup-item">
                                {item.done ? <RiCheckLine className="is-done" /> : <RiCircleLine />}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
