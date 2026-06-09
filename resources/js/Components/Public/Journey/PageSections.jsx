import { useState } from 'react';
import { Link } from '../../../app';
import RichTextContent from '../../Cms/RichTextContent';
import { IconBubble, ResponsiveImage } from '../../Public';
import { DevelopmentTimeline, StoryStats } from './HomeSections';
import { RiArrowRightLine } from 'react-icons/ri';

export function PageHero({ eyebrow, title, lead, actions }) {
    return (
        <section className="j-wrap j-bg-mesh j-page-hero">
            <div className="j-section-inner j-page-hero-grid">
                <div>
                    {eyebrow && <p className="j-eyebrow">{eyebrow}</p>}
                    <h1 className="j-title">{title}</h1>
                    {lead && <p className="j-lead">{lead}</p>}
                    {actions}
                </div>
                <div className="hidden md:block rounded-[1.5rem] border border-white/10 p-6 text-sm text-muted" style={{ background: 'color-mix(in srgb, var(--color-text) 3%, transparent)' }}>
                    <p className="font-bold text-primary">Every page answers:</p>
                    <ul className="mt-4 grid gap-2">
                        {['Who are you?', 'What do you do?', 'Why trust you?', 'How do you work?', 'What results?', 'How to start?'].map((q) => (
                            <li key={q} className="flex items-center gap-2"><span className="text-primary">→</span>{q}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export function ProblemList({ problems }) {
    return (
        <section className="j-section j-bg-panel">
            <div className="j-section-inner">
                <p className="j-eyebrow">Business problems</p>
                <h2 className="j-title">Symptoms we hear from growing companies</h2>
                <div className="j-problem-stack">
                    {problems.map((item, i) => (
                        <div key={item.title} className="j-problem-row">
                            <span className="j-problem-num">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="mt-1 text-sm text-muted">{item.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ServiceDeepList({ services }) {
    return (
        <section className="j-section">
            <div className="j-section-inner">
                <p className="j-eyebrow">Detailed services</p>
                <h2 className="j-title">Solutions mapped to business outcomes</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    {services.map((service) => (
                        <article key={service.id} className="rounded-[1.35rem] border border-white/10 p-6" style={{ background: 'color-mix(in srgb, var(--color-text) 2%, transparent)' }}>
                            <IconBubble name={service.icon} />
                            <h3 className="text-xl font-bold">{service.name}</h3>
                            <RichTextContent html={service.excerpt} className="mt-3 text-sm text-muted" />
                            <ul className="mt-4 grid gap-2">
                                {(service.benefits || []).map((b) => (
                                    <li key={b} className="text-sm text-muted">+ {b}</li>
                                ))}
                            </ul>
                            <Link href={`/services/${service.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                Deep dive <RiArrowRightLine />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function TechStack() {
    const stack = [
        { group: 'Backend', items: ['Laravel', 'PHP', 'REST APIs', 'Queue workers'] },
        { group: 'Frontend', items: ['React', 'Inertia', 'Tailwind', 'Framer Motion'] },
        { group: 'Data & Ops', items: ['MySQL / SQLite', 'Redis', 'Cloudinary', 'CI/CD'] },
        { group: 'Integrations', items: ['bKash / EPS', 'Email', 'Analytics', 'Third-party APIs'] },
    ];

    return (
        <section className="j-section j-bg-diagonal">
            <div className="j-section-inner">
                <p className="j-eyebrow">Technology</p>
                <h2 className="j-title">Modern stack, maintainable architecture</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stack.map((row) => (
                        <div key={row.group} className="j-bento-item">
                            <strong>{row.group}</strong>
                            <span>{row.items.join(' · ')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function PortfolioCaseGrid({ items }) {
    const [active, setActive] = useState(0);
    const featured = items[active] || items[0];

    return (
        <section className="sw-cases">
            <div className="sw-related-strip">
                {items.map((item, i) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`sw-related-item sw-portfolio-pick${i === active ? ' is-active' : ''}`}
                        onClick={() => setActive(i)}
                        style={{ textAlign: 'left', width: '100%' }}
                    >
                        <span>{item.category} · {item.client}</span>
                        <strong>{item.project_name}</strong>
                        <p>{item.excerpt}</p>
                    </button>
                ))}
            </div>
            {featured && (
                <article className="sw-case-featured" style={{ marginTop: '2rem' }}>
                    <div className="sw-case-visual">
                        {featured.image_path ? (
                            <ResponsiveImage media={featured.image_media} src={featured.image_path} alt={featured.project_name} width={1200} />
                        ) : (
                            <div className="sw-case-visual-fallback"><span>{featured.category}</span></div>
                        )}
                    </div>
                    <div className="sw-case-narrative">
                        <h3>{featured.project_name}</h3>
                        <div className="sw-case-pillars">
                            <div><small>Challenge</small><p>{featured.excerpt}</p></div>
                            <div><small>Outcome</small><p>Integrated software platform with measurable operational gains.</p></div>
                        </div>
                        <Link href={`/portfolio/${featured.slug}`} className="sw-case-cta">
                            Read full case study <RiArrowRightLine />
                        </Link>
                    </div>
                </article>
            )}
        </section>
    );
}

export function PackageJourney({ packages }) {
    const audiences = {
        'Startup Website': { who: 'Early-stage founders needing credibility fast', size: '1–10 people', outcome: 'Launch a conversion-ready presence in weeks' },
        'Business Growth': { who: 'Growing SMEs ready to scale content & leads', size: '10–50 people', outcome: 'CMS, blog, portfolio and analytics in one system' },
        'Custom Platform': { who: 'Teams needing ERP, SaaS or ecommerce', size: '50+ or complex ops', outcome: 'Roadmap-based product engineering partnership' },
    };

    return (
        <section className="j-section">
            <div className="j-section-inner">
                <p className="j-eyebrow">Engagement models</p>
                <h2 className="j-title">Choose the path that matches your ambition</h2>
                <div className="j-package-compare">
                    {packages.map((plan) => {
                        const meta = audiences[plan.name] || { who: 'Teams with defined software goals', size: 'Varies', outcome: 'Tailored delivery' };
                        return (
                            <article key={plan.id} className={`j-package-card${plan.is_highlighted ? ' is-featured' : ''}`}>
                                {plan.is_highlighted && <span className="text-xs font-bold uppercase text-primary">Recommended</span>}
                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className="j-package-audience"><strong>For:</strong> {meta.who}</p>
                                <p className="j-package-audience"><strong>Team size:</strong> {meta.size}</p>
                                <p className="j-package-audience"><strong>Outcome:</strong> {meta.outcome}</p>
                                <p className="text-3xl font-black">{plan.price}</p>
                                <p className="text-sm text-muted">{plan.duration}</p>
                                <ul className="grid gap-2 text-sm text-muted">
                                    {(plan.features || []).map((f) => <li key={f}>+ {f}</li>)}
                                </ul>
                                <Link href={plan.button_url || '/contact'} className="btn-primary inline-flex rounded-full px-5 py-3 text-sm font-bold">
                                    {plan.button_text || 'Discuss package'}
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function AboutJourney({ page, stats, team, sections }) {
    const about = sections?.about || {};
    const milestones = [
        { year: '2020', title: 'Founded', body: 'Started as a product-focused engineering studio in Dhaka.' },
        { year: '2022', title: 'ERP & SaaS', body: 'Expanded into enterprise workflows and client portals.' },
        { year: '2024', title: 'Platform CMS', body: 'Built admin-first CMS for agency-grade delivery.' },
        { year: 'Today', title: 'Transformation partner', body: 'Full-stack software for regional and global clients.' },
    ];

    return (
        <>
            <section className="j-section j-bg-panel">
                <div className="j-section-inner">
                    <p className="j-eyebrow">Our story</p>
                    <h2 className="j-title">{page?.name || about.title || 'Built for businesses that take software seriously'}</h2>
                    <RichTextContent html={page?.content || about.content} className="j-lead" />
                </div>
            </section>
            <section className="j-section">
                <div className="j-section-inner">
                    <p className="j-eyebrow">Journey</p>
                    <h2 className="j-title">How we became a digital transformation partner</h2>
                    <div className="j-timeline">
                        {milestones.map((m) => (
                            <div key={m.year} className="j-timeline-step">
                                <span className="j-timeline-dot" />
                                <h4>{m.year}</h4>
                                <p><strong>{m.title}</strong> — {m.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <StoryStats stats={stats} />
            <section className="j-section j-bg-panel">
                <div className="j-section-inner">
                    <p className="j-eyebrow">Leadership</p>
                    <h2 className="j-title">The team behind your product</h2>
                    <div className="j-team-row">
                        {team.map((member) => (
                            <article key={member.id} className="j-team-card">
                                <ResponsiveImage media={member.photo_media} src={member.photo_path} alt={member.name} width={400} />
                                <h4 className="font-bold">{member.name}</h4>
                                <p className="text-sm text-primary">{member.position}</p>
                                <RichTextContent html={member.bio} className="mt-2 text-sm text-muted" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export { DevelopmentTimeline, StoryStats };
