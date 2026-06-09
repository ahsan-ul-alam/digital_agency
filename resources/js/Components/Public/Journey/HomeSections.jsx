import { useState } from 'react';
import { Link } from '../../../app';
import RichTextContent from '../../Cms/RichTextContent';
import { ResponsiveImage } from '../../Public';
import InteractiveEcosystem from './InteractiveEcosystem';
import SoftwareProductShowcase from './SoftwareProductShowcase';
import { motion } from 'framer-motion';
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiArrowRightUpLine,
    RiCalendarCheckLine,
    RiCheckLine,
    RiCloseLine,
    RiFileList3Line,
    RiMailLine,
    RiPlayFill,
    RiShieldCheckLine,
} from 'react-icons/ri';

const CHALLENGES = [
    { num: '01', title: 'Manual operations', body: 'Finance, inventory and sales run on spreadsheets — errors compound daily.', metric: '40+ hrs/week lost' },
    { num: '02', title: 'Revenue leakage', body: 'No pipeline visibility. Follow-ups slip. Checkout and billing break silently.', metric: '18% avg drop-off' },
    { num: '03', title: 'Disconnected systems', body: 'ERP, CRM, ecommerce and POS do not talk. Data is duplicated everywhere.', metric: '6+ tools typical' },
    { num: '04', title: 'Slow decisions', body: 'Leadership waits days for reports that should be real-time dashboards.', metric: '3–5 day lag' },
    { num: '05', title: 'Legacy lock-in', body: 'Old software cannot scale with new branches, channels or compliance needs.', metric: 'High change cost' },
];

const TIMELINE_STEPS = [
    { title: 'Discovery', body: 'Map workflows, stakeholders and constraints' },
    { title: 'Planning', body: 'Architecture, milestones and success metrics' },
    { title: 'Design', body: 'Product UX and operational interfaces' },
    { title: 'Development', body: 'Laravel, React, APIs and integrations' },
    { title: 'Testing', body: 'QA, load, security and UAT' },
    { title: 'Launch', body: 'Deployment, training and handover' },
    { title: 'Support', body: 'Monitoring, iteration and scale' },
];

const INDUSTRIES = [
    { name: 'Healthcare', stat: 'Patient portals & compliance' },
    { name: 'Education', stat: 'LMS & enrollment systems' },
    { name: 'Retail', stat: 'POS + ecommerce unified' },
    { name: 'Manufacturing', stat: 'ERP & production tracking' },
    { name: 'Logistics', stat: 'Fleet & warehouse ops' },
    { name: 'Real Estate', stat: 'CRM & transaction portals' },
    { name: 'Travel', stat: 'Booking & partner networks' },
    { name: 'SaaS', stat: 'Subscription platforms' },
];

const TRADITIONAL = ['Template websites', 'No operational depth', 'Handoff after launch', 'Agency deliverables', 'No product ownership'];
const ARSOFT = ['Business diagnosis first', 'ERP/CRM/commerce systems', 'Measurable KPIs', 'Long-term engineering partner', 'Product thinking'];

const HERO_DEFAULT_STATS = [
    { value: '500', suffix: '+', label: 'Systems delivered' },
    { value: '50', suffix: '+', label: 'Processes automated' },
    { value: '100', suffix: '+', label: 'Enterprise clients' },
];

function isTeamMemberHeroStat(stat) {
    const label = (stat?.label || '').toLowerCase();
    return label.includes('team member') || label === 'expert team';
}

function heroProofStats(stats = []) {
    const source = stats.length ? stats : HERO_DEFAULT_STATS;
    return source.filter((stat) => !isTeamMemberHeroStat(stat)).slice(0, 3);
}

export function JourneyHero({ section, stats = [] }) {
    const payload = section?.payload || {};
    const title = section?.title || 'Enterprise Software For Growing Businesses';
    const highlight = payload.highlight || 'Growing Businesses';
    const parts = highlight && title.includes(highlight) ? title.split(highlight) : [title, ''];

    return (
        <section className="sw-hero">
            <div className="sw-hero-bg" />
            <div className="sw-hero-inner site-container">
                <div className="sw-hero-copy">
                    <div className="sw-hero-badge"><RiShieldCheckLine /> Software product company · Dhaka</div>
                    <h1 className="sw-hero-title">
                        {parts.length > 1 ? (
                            <>{parts[0]}<em>{highlight}</em>{parts[1]}</>
                        ) : title}
                    </h1>
                    <p className="sw-hero-lead">
                        {section?.content || 'We design and build ERP, CRM, ecommerce, POS, LMS and custom business systems — not brochure websites.'}
                    </p>
                    <div className="sw-hero-cta">
                        <Link href={payload.primary_url || '/book'} className="sw-btn sw-btn-primary">
                            <RiCalendarCheckLine /> {payload.primary_cta || 'Book architecture call'}
                        </Link>
                        <Link href={payload.secondary_url || '/portfolio'} className="sw-btn sw-btn-outline">
                            {payload.secondary_cta || 'View transformation stories'} <RiArrowRightLine />
                        </Link>
                    </div>
                    <dl className="sw-hero-proof">
                        {heroProofStats(stats).map((s) => (
                            <div key={s.label}>
                                <dt>{s.label}</dt>
                                <dd>{s.value}{s.suffix}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <div className="sw-hero-stage">
                    <SoftwareProductShowcase variant="hero" />
                </div>
            </div>
        </section>
    );
}

export function LogoStrip({ logos }) {
    if (!logos?.length) return null;
    return (
        <section className="sw-logos">
            <p>Trusted by operations teams, SaaS founders and enterprise units</p>
            <div className="sw-logos-track">
                {logos.map((logo) => (
                    <ResponsiveImage key={logo.id} media={logo.logo_media} src={logo.logo_path} alt={logo.name} className="max-h-7 object-contain" width={140} />
                ))}
            </div>
        </section>
    );
}

export function BusinessChallenges() {
    return (
        <section className="sw-pain">
            <div className="sw-pain-layout">
                <aside className="sw-pain-aside">
                    <p className="j-eyebrow">Diagnosis</p>
                    <h2 className="sw-pain-title">When operations break,<br />growth stalls</h2>
                    <p className="sw-pain-lead">We start every engagement by mapping where time, money and data leak — before writing a single line of code.</p>
                    <Link href="/services" className="sw-pain-link">See how we solve this <RiArrowRightUpLine /></Link>
                </aside>
                <div className="sw-pain-list">
                    {CHALLENGES.map((item, i) => (
                        <motion.article
                            key={item.num}
                            className="sw-pain-row"
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <span className="sw-pain-num">{item.num}</span>
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
                            </div>
                            <em>{item.metric}</em>
                        </motion.article>
                    ))}
                </div>
            </div>
            <div className="sw-pain-bridge">
                <h3>We replace chaos with integrated software products.</h3>
                <p>ERP + CRM + commerce + custom modules — engineered as one ecosystem.</p>
            </div>
        </section>
    );
}

export function SolutionEcosystem() {
    return (
        <section className="sw-eco-section">
            <div className="sw-eco-head">
                <p className="j-eyebrow">Product ecosystem</p>
                <h2 className="sw-eco-title">One platform. Every department connected.</h2>
                <p className="sw-eco-lead">Click modules to see how ERP, CRM, ecommerce, POS, HRM and LMS integrate around your business core.</p>
            </div>
            <InteractiveEcosystem />
        </section>
    );
}

export function WhyChooseComparison({ why }) {
    const points = why?.payload?.features || ARSOFT;
    return (
        <section className="sw-split">
            <div className="sw-split-old">
                <p className="sw-split-label">The old way</p>
                <h2>Freelance & template agencies</h2>
                <ul>{TRADITIONAL.map((t) => <li key={t}><RiCloseLine />{t}</li>)}</ul>
            </div>
            <div className="sw-split-divider" aria-hidden />
            <div className="sw-split-new">
                <p className="sw-split-label">AR Soft BD</p>
                <h2>{why?.title || 'Software product engineering'}</h2>
                <p>{why?.subtitle || 'We build systems that run businesses — with the authority, scale and trust of a product company.'}</p>
                <ul>{points.map((t) => <li key={t}><RiCheckLine />{t}</li>)}</ul>
                <Link href="/about" className="sw-btn sw-btn-primary mt-8">
                    Our engineering approach <RiArrowRightLine />
                </Link>
            </div>
        </section>
    );
}

export function SuccessStories({ portfolios }) {
    const [active, setActive] = useState(0);
    if (!portfolios?.length) return null;

    const featured = portfolios[active] || portfolios[0];
    const plain = (html) => String(html || '').replace(/<[^>]+>/g, '');

    return (
        <section className="sw-cases">
            <header className="sw-cases-head">
                <div>
                    <p className="j-eyebrow">Transformation stories</p>
                    <h2 className="sw-cases-title">Business outcomes,<br />not portfolio thumbnails</h2>
                </div>
                <Link href="/portfolio" className="sw-btn sw-btn-outline">
                    All case studies <RiArrowRightLine />
                </Link>
            </header>

            <article className="sw-case-featured">
                <div className="sw-case-visual">
                    {featured.image_path ? (
                        <ResponsiveImage media={featured.image_media} src={featured.image_path} alt={featured.project_name} width={1200} />
                    ) : (
                        <div className="sw-case-visual-fallback"><span>{featured.category}</span></div>
                    )}
                    <div className="sw-case-visual-overlay">
                        <span>{featured.client}</span>
                        <strong>{featured.category} transformation</strong>
                    </div>
                </div>
                <div className="sw-case-narrative">
                    <div className="sw-case-tabs">
                        {portfolios.slice(0, 3).map((item, i) => (
                            <button key={item.id} type="button" className={i === active ? 'is-active' : ''} onClick={() => setActive(i)}>
                                {item.project_name}
                            </button>
                        ))}
                    </div>
                    <h3>{featured.project_name}</h3>
                    <div className="sw-case-pillars">
                        <div><small>Challenge</small><p>{featured.excerpt}</p></div>
                        <div><small>Solution</small><p>{plain(featured.description).slice(0, 200)}…</p></div>
                        <div><small>Systems built</small><p>ERP modules · Admin console · Client portal · Payment integration</p></div>
                    </div>
                    <Link href={`/portfolio/${featured.slug}`} className="sw-case-cta">
                        Read full case study <RiArrowRightLine />
                    </Link>
                </div>
            </article>
        </section>
    );
}

export function DevelopmentTimeline({ process }) {
    const steps = process?.payload?.steps?.length >= 5
        ? [...process.payload.steps.slice(0, 5), { title: 'Launch', body: 'Go-live & training' }, { title: 'Support', body: 'Scale & iterate' }]
        : TIMELINE_STEPS;

    return (
        <section className="sw-process">
            <div className="sw-process-layout">
                <aside className="sw-process-aside">
                    <p className="j-eyebrow">Delivery</p>
                    <h2>{process?.title || 'From discovery to production'}</h2>
                    <p>{process?.subtitle || 'Structured engineering for ERP, CRM and platform builds — not one-off page launches.'}</p>
                </aside>
                <ol className="sw-process-track">
                    {steps.slice(0, 7).map((step, i) => (
                        <li key={step.title}>
                            <span>{String(i + 1).padStart(2, '0')}</span>
                            <div>
                                <strong>{step.title}</strong>
                                <p>{step.body?.replace?.(/<[^>]+>/g, '') || step.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export function IndustryExpertise() {
    return (
        <section className="sw-industries">
            <div className="sw-industries-marquee">
                <div className="sw-industries-track">
                    {[...INDUSTRIES, ...INDUSTRIES].map((item, i) => (
                        <div key={`${item.name}-${i}`} className="sw-industry-item">
                            <strong>{item.name}</strong>
                            <span>{item.stat}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="sw-industries-copy">
                <h2>Industry depth across regulated and high-volume sectors</h2>
                <p>We bring domain context to ERP, CRM, LMS and commerce builds — so software matches how your sector actually operates.</p>
            </div>
        </section>
    );
}

export function ProductShowcase() {
    const products = [
        { code: 'ERP', name: 'Enterprise Resource Planning', desc: 'Finance · Procurement · Inventory · Reporting', color: 'is-erp' },
        { code: 'CRM', name: 'Customer Relationship Platform', desc: 'Leads · Pipeline · Portals · Retention', color: 'is-crm' },
        { code: 'ECOM', name: 'Ecommerce & Omnichannel', desc: 'Storefront · Payments · Fulfillment · Analytics', color: 'is-ecom' },
        { code: 'POS', name: 'Point of Sale Network', desc: 'Retail · Sync · Receipts · Central stock', color: 'is-pos' },
        { code: 'LMS', name: 'Learning Management', desc: 'Courses · Certs · Progress · Institutions', color: 'is-lms' },
        { code: 'CUSTOM', name: 'Custom Business Systems', desc: 'Workflows · APIs · Integrations · Roadmaps', color: 'is-custom' },
    ];

    return (
        <section className="sw-products">
            <header>
                <p className="j-eyebrow">What we build</p>
                <h2>Software products, not service brochures</h2>
            </header>
            <div className="sw-products-stack">
                {products.map((p, i) => (
                    <motion.div
                        key={p.code}
                        className={`sw-product-row ${p.color}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                    >
                        <span className="sw-product-code">{p.code}</span>
                        <div>
                            <h3>{p.name}</h3>
                            <p>{p.desc}</p>
                        </div>
                        <Link href="/services" className="sw-btn sw-btn-ghost sw-btn-sm">
                            Explore <RiArrowRightLine />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export function StoryStats({ stats }) {
    const items = stats?.length ? stats.slice(0, 3) : [
        { value: 500, suffix: '+', label: 'Systems delivered' },
        { value: 50, suffix: '+', label: 'Processes automated' },
        { value: 100, suffix: '+', label: 'Clients served' },
    ];
    const narratives = [
        'Manufacturers replacing spreadsheet ERP with live dashboards.',
        'Retailers unifying POS, ecommerce and warehouse in one stack.',
        'SaaS teams shipping client portals with billing and project workspaces.',
    ];

    return (
        <section className="sw-impact">
            {items.map((stat, i) => (
                <article key={stat.label} className="sw-impact-block">
                    <div className="sw-impact-num">{stat.value}<span>{stat.suffix}</span></div>
                    <div className="sw-impact-copy">
                        <h3>{stat.label}</h3>
                        <p>{narratives[i]}</p>
                    </div>
                </article>
            ))}
        </section>
    );
}

export function ReviewsCarousel({ testimonials }) {
    const [index, setIndex] = useState(0);
    if (!testimonials?.length) return null;
    const item = testimonials[index];

    return (
        <section className="sw-testimonial">
            <div className="sw-testimonial-stage">
                <button type="button" className="sw-testimonial-nav" onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} aria-label="Previous"><RiArrowLeftLine /></button>
                <blockquote>
                    <div className="sw-testimonial-meta">
                        <span className="sw-testimonial-play"><RiPlayFill /></span>
                        <span>Executive testimonial · {item.company}</span>
                    </div>
                    <RichTextContent html={item.review} />
                    <footer>
                        <ResponsiveImage media={item.photo_media} src={item.photo_path} alt={item.client_name} width={80} />
                        <div>
                            <cite>{item.client_name}</cite>
                            <span>{item.designation}, {item.company}</span>
                        </div>
                    </footer>
                </blockquote>
                <button type="button" className="sw-testimonial-nav" onClick={() => setIndex((i) => (i + 1) % testimonials.length)} aria-label="Next"><RiArrowRightLine /></button>
            </div>
        </section>
    );
}

export function TeamCulture({ about, team }) {
    const lead = team[0];
    const cards = about?.payload?.cards || [];

    return (
        <section className="sw-team">
            <div className="sw-team-editorial">
                {lead && (
                    <div className="sw-team-lead">
                        <ResponsiveImage media={lead.photo_media} src={lead.photo_path} alt={lead.name} width={600} />
                        <div>
                            <p className="j-eyebrow">Leadership</p>
                            <h2>{lead.name}</h2>
                            <p className="text-primary font-semibold">{lead.position}</p>
                            <RichTextContent html={lead.bio} className="mt-4 text-muted" />
                        </div>
                    </div>
                )}
                <div className="sw-team-values">
                    {cards.map((card) => (
                        <div key={card.title}>
                            <h3>{card.title}</h3>
                            <RichTextContent html={card.body} className="text-muted" />
                        </div>
                    ))}
                    <Link href="/about" className="sw-team-link">Full company story →</Link>
                </div>
            </div>
            {team.length > 1 && (
                <div className="sw-team-strip">
                    {team.slice(1).map((m) => (
                        <div key={m.id}>
                            <strong>{m.name}</strong>
                            <span>{m.position}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export function FaqAccordion({ faqs }) {
    if (!faqs?.length) return null;
    return (
        <section className="sw-faq">
            <div className="sw-faq-layout">
                <aside>
                    <p className="j-eyebrow">FAQ</p>
                    <h2>Questions from CTOs, founders and operations leads</h2>
                </aside>
                <div className="sw-faq-list">
                    {faqs.map((faq) => (
                        <details key={faq.id} className="sw-faq-item">
                            <summary>{faq.question}</summary>
                            <RichTextContent html={faq.answer} />
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ConversionCta({ section }) {
    const payload = section?.payload || {};
    return (
        <section className="sw-cta">
            <div className="sw-cta-mesh" />
            <div className="sw-cta-inner">
                <p className="j-eyebrow">Start building</p>
                <h2>{section?.title || 'Ready to replace spreadsheets with software?'}</h2>
                <RichTextContent html={section?.content} className="sw-cta-lead" />
                <div className="sw-cta-actions">
                    <Link href="/book" className="sw-btn sw-btn-primary">
                        <RiCalendarCheckLine /> Book architecture call
                    </Link>
                    <Link href="/quote" className="sw-btn sw-btn-outline">
                        <RiFileList3Line /> Request scoped proposal
                    </Link>
                    <Link href={payload.url || '/contact'} className="sw-btn sw-btn-ghost">
                        <RiMailLine /> {payload.button || 'Contact engineering team'}
                    </Link>
                </div>
            </div>
        </section>
    );
}
