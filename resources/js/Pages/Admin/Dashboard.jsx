import AdminLayout from '../../Layouts/AdminLayout';
import { Link } from '../../app';
import { NavIcon } from '../../Admin/icons';
import {
    RiArrowRightLine,
    RiCheckLine,
    RiCircleLine,
    RiPulseLine,
    RiSparklingLine,
} from 'react-icons/ri';

function MetricCard({ item, max }) {
    const width = max > 0 ? Math.max(12, (item.value / max) * 100) : 12;

    return (
        <Link href={item.href} className="admin-metric-card">
            <div className="admin-metric-head">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
            </div>
            <div className="admin-metric-bar">
                <span style={{ width: `${width}%` }} />
            </div>
            <p className="admin-metric-meta">+{item.change} this week</p>
        </Link>
    );
}

function HealthPill({ item }) {
    return (
        <Link href={item.href} className={`admin-health-pill is-${item.status}`}>
            <span className="admin-health-dot" />
            <span className="admin-health-copy">
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
            </span>
        </Link>
    );
}

function QuickActionCard({ action }) {
    return (
        <Link href={action.href} className={`admin-quick-card ${action.tone === 'primary' ? 'is-primary' : ''} ${action.tone === 'alert' ? 'is-alert' : ''}`}>
            <span className="admin-quick-icon"><NavIcon name={action.icon} /></span>
            <span className="admin-quick-copy">
                <strong>{action.label}</strong>
                <small>{action.description}</small>
            </span>
            <RiArrowRightLine />
        </Link>
    );
}

export default function Dashboard({
    greeting,
    summary,
    analytics,
    health,
    quickActions,
    setup,
    latestContacts,
    recentActivities,
    popularContent,
    pendingTasks,
}) {
    const setupDone = setup.filter((item) => item.done).length;
    const maxMetric = Math.max(...analytics.map((item) => item.value), 1);

    return (
        <AdminLayout title="Dashboard" subtitle="Your agency command center for content, leads, and website health.">
            <section className="admin-hero">
                <div className="admin-hero-copy">
                    <p className="admin-hero-eyebrow"><RiSparklingLine /> Agency Console</p>
                    <h2>{greeting} 👋</h2>
                    <p>Manage your website, content pipeline, and inbound leads from one intelligent workspace.</p>
                    {pendingTasks.length > 0 && (
                        <div className="admin-hero-tasks">
                            {pendingTasks.map((task) => (
                                <Link key={task.label} href={task.href} className="admin-hero-task">
                                    <RiPulseLine /> {task.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <div className="admin-hero-stats">
                    {[
                        ['Unread Leads', summary.unreadLeads, '/admin/contacts'],
                        ['Published Posts', summary.publishedPosts, '/admin/blog'],
                        ['Active Services', summary.activeServices, '/admin/services'],
                        ['Media Files', summary.mediaFiles, '/admin/media'],
                    ].map(([label, value, href]) => (
                        <Link key={label} href={href} className="admin-hero-stat">
                            <span>{label}</span>
                            <strong>{value}</strong>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="admin-section">
                <div className="admin-section-head">
                    <h3>Quick Actions</h3>
                    <p>Reach any workflow in one click.</p>
                </div>
                <div className="admin-quick-grid">
                    {quickActions.map((action) => <QuickActionCard key={action.label} action={action} />)}
                </div>
            </section>

            <div className="admin-dashboard-grid">
                <section className="admin-panel">
                    <div className="admin-section-head">
                        <h3>Performance Overview</h3>
                        <p>Content and lead activity across your site.</p>
                    </div>
                    <div className="admin-metric-grid">
                        {analytics.map((item) => <MetricCard key={item.label} item={item} max={maxMetric} />)}
                    </div>
                </section>

                <section className="admin-panel">
                    <div className="admin-section-head">
                        <h3>Website Health</h3>
                        <p>Operational status of core systems.</p>
                    </div>
                    <div className="admin-health-grid">
                        {health.map((item) => <HealthPill key={item.label} item={item} />)}
                    </div>
                </section>
            </div>

            <div className="admin-dashboard-grid admin-dashboard-grid-wide">
                <section className="admin-panel">
                    <div className="admin-section-head">
                        <h3>Recent Activity</h3>
                        <p>Latest changes across pages, blog, and services.</p>
                    </div>
                    {recentActivities.length === 0 ? (
                        <div className="admin-empty-state">No recent activity yet. Start by creating a page or blog post.</div>
                    ) : (
                        <div className="admin-timeline">
                            {recentActivities.map((item) => (
                                <Link key={`${item.type}-${item.title}`} href={item.href} className="admin-timeline-item">
                                    <span className="admin-timeline-dot" />
                                    <span className="admin-timeline-copy">
                                        <strong>{item.title}</strong>
                                        <small>{item.meta}</small>
                                    </span>
                                    <span className="admin-timeline-time">{item.time}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="admin-panel">
                    <div className="admin-section-head">
                        <h3>Recent Inquiries</h3>
                        <Link href="/admin/contacts" className="admin-inline-link">View all</Link>
                    </div>
                    {latestContacts.length === 0 ? (
                        <div className="admin-empty-state">No inquiries yet. Submissions from hero and contact forms appear here.</div>
                    ) : (
                        <div className="admin-inbox-list">
                            {latestContacts.map((item) => (
                                <Link key={item.id} href={`/admin/contacts/${item.id}/edit`} className="admin-inbox-item">
                                    <span>
                                        <strong>{item.name}</strong>
                                        <small>{item.email}</small>
                                    </span>
                                    {!item.read_at && <span className="admin-badge-new">New</span>}
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="admin-dashboard-grid">
                <section className="admin-panel">
                    <div className="admin-section-head">
                        <h3>Popular Content</h3>
                        <p>Highlighted packages, portfolio, and blog posts.</p>
                    </div>
                    <div className="admin-popular-grid">
                        {popularContent.map((block) => (
                            <Link key={block.label} href={block.href} className="admin-popular-card">
                                <strong>{block.label}</strong>
                                {block.value.length === 0 ? (
                                    <p className="admin-popular-empty">Nothing featured yet</p>
                                ) : (
                                    <ul>
                                        {block.value.map((entry) => <li key={entry}>{entry}</li>)}
                                    </ul>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="admin-panel">
                    <div className="admin-section-head">
                        <h3>Setup Progress</h3>
                        <span className="admin-setup-count">{setupDone}/{setup.length}</span>
                    </div>
                    <div className="admin-setup-bar">
                        <span style={{ width: `${(setupDone / setup.length) * 100}%` }} />
                    </div>
                    <div className="admin-setup-list">
                        {setup.map((item) => (
                            <Link key={item.label} href={item.href} className="admin-setup-item">
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
