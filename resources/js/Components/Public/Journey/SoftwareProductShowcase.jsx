import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiBarChartGroupedLine,
    RiCustomerService2Line,
    RiDashboardLine,
    RiGraduationCapLine,
    RiNodeTree,
    RiShoppingCart2Line,
    RiStore2Line,
    RiStore3Line,
    RiTeamLine,
} from 'react-icons/ri';

const MODULES = [
    {
        id: 'erp',
        label: 'ERP Console',
        icon: RiNodeTree,
        kpis: [
            { label: 'Revenue MTD', value: '৳2.4M', delta: '+18%' },
            { label: 'Open POs', value: '142', delta: '-12%' },
            { label: 'Stock alerts', value: '7', delta: 'action' },
        ],
        chart: [42, 58, 45, 72, 65, 88, 76],
        rows: [
            ['PO-2041', 'Procurement', 'Approved', '৳84,200'],
            ['INV-8832', 'Warehouse A', 'Shipped', '৳31,500'],
            ['REQ-1190', 'Finance', 'Pending', '৳12,800'],
            ['GRN-5521', 'Inventory', 'Received', '৳46,300'],
        ],
        feed: [
            'Inventory sync completed across 3 warehouses',
            'Approval workflow triggered for PO-2041',
            'Monthly P&L report exported to finance',
            'Low stock threshold updated for SKU batch',
        ],
        status: [
            { label: 'Warehouses', value: '3 online' },
            { label: 'Sync', value: 'Real-time' },
            { label: 'Approvals', value: '12 pending' },
            { label: 'Uptime', value: '99.9%' },
        ],
    },
    {
        id: 'crm',
        label: 'CRM Pipeline',
        icon: RiTeamLine,
        kpis: [
            { label: 'Active deals', value: '38', delta: '+6' },
            { label: 'Win rate', value: '34%', delta: '+4%' },
            { label: 'Follow-ups', value: '12', delta: 'today' },
        ],
        chart: [30, 44, 52, 48, 61, 70, 82],
        rows: [
            ['Northstar ERP', 'Proposal', '৳1.2M', 'Hot'],
            ['RetailFlow', 'Discovery', '৳640K', 'Warm'],
            ['GrowthStack', 'Negotiation', '৳2.1M', 'Hot'],
            ['MediCore', 'Qualified', '৳890K', 'Warm'],
        ],
        feed: [
            'Lead assigned to enterprise account team',
            'Proposal viewed by Northstar stakeholders',
            'Meeting booked for Thursday · demo slot',
            'Pipeline forecast recalculated for Q3',
        ],
        status: [
            { label: 'Pipeline', value: '৳8.4M' },
            { label: 'Accounts', value: '64 active' },
            { label: 'Tasks', value: '28 due' },
            { label: 'Uptime', value: '99.9%' },
        ],
    },
    {
        id: 'commerce',
        label: 'Ecommerce Ops',
        icon: RiShoppingCart2Line,
        kpis: [
            { label: 'Orders today', value: '286', delta: '+22%' },
            { label: 'AOV', value: '৳3,420', delta: '+9%' },
            { label: 'Fulfillment', value: '96%', delta: 'SLA' },
        ],
        chart: [55, 62, 48, 80, 74, 91, 95],
        rows: [
            ['#ORD-92811', 'bKash', 'Paid', '৳4,200'],
            ['#ORD-92809', 'EPS', 'Processing', '৳8,950'],
            ['#ORD-92804', 'Bank', 'Fulfilled', '৳2,180'],
            ['#ORD-92798', 'COD', 'Shipped', '৳6,740'],
        ],
        feed: [
            'Payment confirmed via bKash gateway',
            'Low stock alert triggered for SKU-441',
            'Courier label generated · Express batch',
            'Abandoned cart recovery email sent (14)',
        ],
        status: [
            { label: 'Channels', value: '4 live' },
            { label: 'Payments', value: 'All OK' },
            { label: 'Returns', value: '2 open' },
            { label: 'Uptime', value: '99.9%' },
        ],
    },
];

const SIDEBAR_EXTRA = [
    { label: 'POS Network', icon: RiStore3Line },
    { label: 'LMS Portal', icon: RiGraduationCapLine },
];

export default function SoftwareProductShowcase({ variant = 'default' }) {
    const [active, setActive] = useState('erp');
    const [tick, setTick] = useState(0);
    const module = MODULES.find((m) => m.id === active) || MODULES[0];
    const Icon = module.icon;
    const isHero = variant === 'hero';

    useEffect(() => {
        const timer = setInterval(() => setTick((t) => t + 1), 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const rotate = setInterval(() => {
            setActive((current) => {
                const idx = MODULES.findIndex((m) => m.id === current);
                return MODULES[(idx + 1) % MODULES.length].id;
            });
        }, 8000);
        return () => clearInterval(rotate);
    }, []);

    const maxChart = Math.max(...module.chart);

    return (
        <div className={`sw-showcase${isHero ? ' sw-showcase--hero' : ''}`}>
            <div className="sw-showcase-glow" />
            <div className="sw-window">
                <div className="sw-titlebar">
                    <span className="sw-dot" /><span className="sw-dot" /><span className="sw-dot" />
                    <span className="sw-titlebar-label">AR Soft BD · Business Platform</span>
                    <span className="sw-live"><span className="sw-live-pulse" /> Live</span>
                </div>

                <div className="sw-body">
                    <aside className="sw-sidebar">
                        <div className="sw-brand"><RiDashboardLine /> Console</div>
                        {MODULES.map((m) => {
                            const ModIcon = m.icon;
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    className={`sw-nav${active === m.id ? ' is-active' : ''}`}
                                    onClick={() => setActive(m.id)}
                                >
                                    <ModIcon /> {m.label}
                                </button>
                            );
                        })}
                        {isHero && SIDEBAR_EXTRA.map((item) => {
                            const ExtraIcon = item.icon;
                            return (
                                <span key={item.label} className="sw-nav is-muted">
                                    <ExtraIcon /> {item.label}
                                </span>
                            );
                        })}
                        <div className="sw-sidebar-foot">
                            <small>Modules</small>
                            <span>ERP · CRM · Commerce · POS · LMS</span>
                        </div>
                    </aside>

                    <div className="sw-main">
                        <header className="sw-main-head">
                            <div>
                                <p className="sw-module-tag"><Icon /> {module.label}</p>
                                <h3>Operations command center</h3>
                            </div>
                            <div className="sw-head-actions">
                                <span>Sync {tick % 60}s ago</span>
                                <button type="button">Export</button>
                            </div>
                        </header>

                        <div className="sw-main-body-slot">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active}
                                    className="sw-main-body"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="sw-kpis">
                                        {module.kpis.map((kpi) => (
                                            <div key={kpi.label} className="sw-kpi">
                                                <small>{kpi.label}</small>
                                                <strong>{kpi.value}</strong>
                                                <em className={kpi.delta.includes('+') ? 'is-up' : ''}>{kpi.delta}</em>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="sw-dashboard-grid">
                                        <div className="sw-chart-panel">
                                            <div className="sw-chart-head">
                                                <span><RiBarChartGroupedLine /> Performance</span>
                                                <small>Last 7 days</small>
                                            </div>
                                            <div className="sw-bars">
                                                {module.chart.map((v, i) => (
                                                    <div key={i} className="sw-bar-wrap">
                                                        <motion.span
                                                            className="sw-bar"
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${(v / maxChart) * 100}%` }}
                                                            transition={{ delay: i * 0.05, duration: 0.4 }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="sw-table-panel">
                                            <div className="sw-chart-head">
                                                <span><RiStore2Line /> Transactions</span>
                                                <small>Latest</small>
                                            </div>
                                            <table className="sw-table">
                                                <tbody>
                                                    {module.rows.map((row) => (
                                                        <tr key={row[0]}>
                                                            {row.map((cell, ci) => (
                                                                <td key={cell} className={ci === row.length - 1 ? 'is-status' : ''}>{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="sw-feed-panel">
                                            <div className="sw-chart-head">
                                                <span><RiCustomerService2Line /> Activity stream</span>
                                                <small>Live</small>
                                            </div>
                                            <ul className="sw-feed">
                                                {module.feed.map((line) => (
                                                    <li key={line}>
                                                        <span className="sw-feed-dot" /> {line}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {isHero && (
                                        <div className="sw-status-strip">
                                            {module.status.map((item) => (
                                                <div key={item.label} className="sw-status-item">
                                                    <small>{item.label}</small>
                                                    <strong>{item.value}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sw-floating-metrics">
                <motion.div className="sw-metric is-a" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                    <strong>ERP</strong><span>Inventory synced</span>
                </motion.div>
                <motion.div className="sw-metric is-b" animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                    <strong>CRM</strong><span>Pipeline updated</span>
                </motion.div>
                <motion.div className="sw-metric is-c" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
                    <strong>POS</strong><span>3 stores online</span>
                </motion.div>
            </div>
        </div>
    );
}
