import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    RiBookOpenLine,
    RiCpuLine,
    RiNodeTree,
    RiShoppingCart2Line,
    RiStore2Line,
    RiTeamLine,
    RiWallet3Line,
} from 'react-icons/ri';

const NODES = [
    {
        id: 'erp',
        label: 'ERP',
        icon: RiNodeTree,
        angle: -90,
        desc: 'Finance, procurement, inventory and reporting in one operational backbone.',
        connects: ['inventory', 'hrm', 'custom'],
        outcomes: ['40% faster approvals', 'Real-time stock visibility', 'Unified reporting'],
    },
    {
        id: 'crm',
        label: 'CRM',
        icon: RiTeamLine,
        angle: -45,
        desc: 'Lead capture, pipeline management and client portals tied to delivery.',
        connects: ['erp', 'ecommerce', 'custom'],
        outcomes: ['Higher conversion', 'Account visibility', 'Automated follow-ups'],
    },
    {
        id: 'ecommerce',
        label: 'Ecommerce',
        icon: RiShoppingCart2Line,
        angle: 0,
        desc: 'Storefront, payments (bKash, EPS), fulfillment and admin operations.',
        connects: ['crm', 'pos', 'inventory'],
        outcomes: ['Omnichannel sales', 'Payment automation', 'Order lifecycle control'],
    },
    {
        id: 'inventory',
        label: 'Inventory',
        icon: RiStore2Line,
        angle: 45,
        desc: 'Warehouse, SKU tracking and replenishment connected to sales channels.',
        connects: ['erp', 'ecommerce', 'pos'],
        outcomes: ['Fewer stockouts', 'Accurate fulfillment', 'Supplier sync'],
    },
    {
        id: 'hrm',
        label: 'HRM',
        icon: RiWallet3Line,
        angle: 90,
        desc: 'Payroll, attendance, roles and employee self-service portals.',
        connects: ['erp', 'lms', 'custom'],
        outcomes: ['HR automation', 'Policy compliance', 'Team productivity'],
    },
    {
        id: 'pos',
        label: 'POS',
        icon: RiCpuLine,
        angle: 135,
        desc: 'In-store checkout synced with central inventory and finance.',
        connects: ['inventory', 'ecommerce', 'erp'],
        outcomes: ['Unified stock', 'Faster checkout', 'Store analytics'],
    },
    {
        id: 'lms',
        label: 'LMS',
        icon: RiBookOpenLine,
        angle: 180,
        desc: 'Courses, assessments, certifications and learning analytics.',
        connects: ['hrm', 'custom'],
        outcomes: ['Scalable training', 'Progress tracking', 'Certification flows'],
    },
    {
        id: 'custom',
        label: 'Custom',
        icon: RiCpuLine,
        angle: 225,
        desc: 'Bespoke modules for workflows no off-the-shelf product covers.',
        connects: ['erp', 'crm', 'lms'],
        outcomes: ['Exact-fit automation', 'API integrations', 'Product roadmaps'],
    },
];

const RADIUS = 42;

function polar(angleDeg, radius = RADIUS) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: 50 + radius * Math.cos(rad),
        y: 50 + radius * Math.sin(rad),
    };
}

export default function InteractiveEcosystem() {
    const [active, setActive] = useState('erp');
    const current = NODES.find((n) => n.id === active) || NODES[0];
    const Icon = current.icon;

    return (
        <div className="eco-stage">
            <div className="eco-canvas">
                <svg className="eco-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <circle cx="50" cy="50" r="38" className="eco-ring" />
                    <circle cx="50" cy="50" r="28" className="eco-ring is-inner" />
                    {NODES.map((node) => {
                        const pos = polar(node.angle, RADIUS);
                        const isConnected = current.connects.includes(node.id) || node.id === active;
                        return (
                            <line
                                key={`line-${node.id}`}
                                x1="50"
                                y1="50"
                                x2={pos.x}
                                y2={pos.y}
                                className={`eco-line${isConnected ? ' is-lit' : ''}`}
                            />
                        );
                    })}
                    {current.connects.map((cid) => {
                        const a = NODES.find((n) => n.id === active);
                        const b = NODES.find((n) => n.id === cid);
                        if (!a || !b) return null;
                        const pa = polar(a.angle, RADIUS);
                        const pb = polar(b.angle, RADIUS);
                        return <line key={`cross-${cid}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="eco-line is-cross" />;
                    })}
                </svg>

                <button type="button" className="eco-hub" onClick={() => setActive('erp')}>
                    <span>Business</span>
                    <strong>Core</strong>
                </button>

                {NODES.map((node) => {
                    const pos = polar(node.angle, RADIUS);
                    const NodeIcon = node.icon;
                    return (
                        <button
                            key={node.id}
                            type="button"
                            className={`eco-node${active === node.id ? ' is-active' : ''}`}
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            onClick={() => setActive(node.id)}
                        >
                            <NodeIcon />
                            <span>{node.label}</span>
                        </button>
                    );
                })}
            </div>

            <motion.div
                key={active}
                className="eco-detail"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <p className="eco-detail-tag"><Icon /> {current.label} module</p>
                <h3>How {current.label} connects to your business</h3>
                <p className="eco-detail-desc">{current.desc}</p>
                <div className="eco-outcomes">
                    <p>Typical outcomes</p>
                    <ul>
                        {current.outcomes.map((o) => <li key={o}>{o}</li>)}
                    </ul>
                </div>
                <p className="eco-hint">Click any module to explore connections</p>
            </motion.div>
        </div>
    );
}
