import PublicLayout from '../../Layouts/PublicLayout';
import RichTextContent from '../../Components/Cms/RichTextContent';
import { ConversionCta } from '../../Components/Public/Journey/HomeSections';
import { ResponsiveImage } from '../../Components/Public';
import { Link } from '../../app';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

export default function PortfolioCaseStudy({ settings, seo, item, related, contactCta }) {
    const plain = (html) => String(html || '').replace(/<[^>]+>/g, '');

    return (
        <PublicLayout settings={settings} seo={seo}>
            <section className="sw-case-study-hero">
                <div className="sw-case-study-hero-inner">
                    <Link href="/portfolio" className="sw-case-back">
                        <RiArrowLeftLine /> All transformations
                    </Link>
                    <p className="j-eyebrow">{item.category} · {item.client}</p>
                    <h1>{item.project_name}</h1>
                    <p className="sw-case-study-lead">{item.excerpt}</p>
                </div>
                {item.image_path && (
                    <div className="sw-case-study-banner">
                        <ResponsiveImage media={item.image_media} src={item.image_path} alt={item.project_name} width={1600} />
                    </div>
                )}
            </section>

            <section className="sw-case-study-body">
                <div className="sw-case-study-grid">
                    <article className="sw-case-study-pillar is-challenge">
                        <span>01 — Challenge</span>
                        <h2>Business pain</h2>
                        <p>{item.excerpt}</p>
                    </article>
                    <article className="sw-case-study-pillar is-solution">
                        <span>02 — Solution</span>
                        <h2>Software built</h2>
                        <RichTextContent html={item.description} />
                    </article>
                    <article className="sw-case-study-pillar is-tech">
                        <span>03 — Technology</span>
                        <h2>Stack & architecture</h2>
                        <ul>
                            <li>Laravel backend & REST APIs</li>
                            <li>React admin console & client portal</li>
                            <li>Role-based workflows & reporting</li>
                            <li>Payment integration (bKash, EPS, bank)</li>
                        </ul>
                    </article>
                    <article className="sw-case-study-pillar is-outcome">
                        <span>04 — Outcome</span>
                        <h2>Measurable impact</h2>
                        <p>Centralized operations, faster reporting cycles and a platform the client team runs without developer dependency.</p>
                        <div className="sw-case-metrics">
                            <div><strong>3×</strong><span>Faster approvals</span></div>
                            <div><strong>1</strong><span>Unified system</span></div>
                            <div><strong>24/7</strong><span>Live dashboards</span></div>
                        </div>
                    </article>
                </div>

                <aside className="sw-case-study-aside">
                    <h3>Project snapshot</h3>
                    <dl>
                        <div><dt>Client</dt><dd>{item.client || '—'}</dd></div>
                        <div><dt>Category</dt><dd>{item.category}</dd></div>
                        <div><dt>Systems</dt><dd>ERP · CRM · Portal</dd></div>
                        <div><dt>Timeline</dt><dd>Roadmap-based delivery</dd></div>
                    </dl>
                    {item.url && item.url !== '#' && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="btn-outline rounded-full px-5 py-2.5 text-sm font-semibold">View live product</a>
                    )}
                </aside>
            </section>

            {related?.length > 0 && (
                <section className="sw-cases" style={{ paddingTop: '3rem' }}>
                    <header className="sw-cases-head">
                        <h2 className="sw-cases-title">More transformations</h2>
                    </header>
                    <div className="sw-related-strip">
                        {related.map((row) => (
                            <Link key={row.id} href={`/portfolio/${row.slug}`} className="sw-related-item">
                                <span>{row.category}</span>
                                <strong>{row.project_name}</strong>
                                <p>{plain(row.excerpt).slice(0, 90)}…</p>
                                <em>Read case study <RiArrowRightLine /></em>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <ConversionCta section={contactCta} />
        </PublicLayout>
    );
}
