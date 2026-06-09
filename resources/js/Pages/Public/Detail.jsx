import PublicLayout from '../../Layouts/PublicLayout';
import { ConversionCta } from '../../Components/Public/Journey/HomeSections';
import { PageHero } from '../../Components/Public/Journey/PageSections';
import { ResponsiveImage } from '../../Components/Public';
import RichTextContent from '../../Components/Cms/RichTextContent';
import { Link } from '../../app';
import { RiCheckLine } from 'react-icons/ri';

export default function Detail({ settings, seo, kind, item, contactCta }) {
    const title = item.name || item.project_name || item.title;

    if (kind === 'service') {
        return (
            <PublicLayout settings={settings} seo={seo}>
                <PageHero
                    eyebrow="Service"
                    title={title}
                    lead={item.excerpt}
                    actions={(
                        <Link href="/contact" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">Discuss this solution</Link>
                    )}
                />
                <section className="j-section">
                    <div className="j-section-inner j-case-hero">
                        {item.banner_path && (
                            <ResponsiveImage media={item.banner_media} src={item.banner_path} alt={title} className="w-full rounded-[1.5rem] object-cover" width={1200} />
                        )}
                        <div className="grid gap-4">
                            <div className="j-case-pillar">
                                <small>Business problem</small>
                                <RichTextContent html={item.excerpt} className="text-muted" />
                            </div>
                            <div className="j-case-pillar">
                                <small>Our approach</small>
                                <RichTextContent html={item.description} className="text-muted" />
                            </div>
                            {(item.benefits || []).length > 0 && (
                                <div className="j-case-pillar">
                                    <small>Outcomes</small>
                                    <ul className="mt-2 grid gap-2">
                                        {item.benefits.map((entry) => (
                                            <li key={entry} className="flex items-center gap-2 text-sm text-muted">
                                                <RiCheckLine className="text-primary" /> {entry}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                {contactCta && <ConversionCta section={contactCta} />}
            </PublicLayout>
        );
    }

    return (
        <PublicLayout settings={settings} seo={seo}>
            <PageHero eyebrow={kind} title={title} lead={item.excerpt || item.client || item.category?.name} />
            <section className="j-section">
                <div className="j-section-inner max-w-4xl">
                    <div className="glass rounded-[1.5rem] p-8">
                        <RichTextContent html={item.description || item.content || item.review} className="text-lg leading-8 text-muted" />
                        {(item.benefits || item.features || item.tags) && (
                            <div className="mt-8 flex flex-wrap gap-3">
                                {(item.benefits || item.features || item.tags || []).map((entry) => (
                                    <span key={entry} className="rounded-full border border-white/10 px-3 py-1 text-sm text-primary">{entry}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
