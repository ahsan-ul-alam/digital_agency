import PublicLayout from '../../Layouts/PublicLayout';
import { Card, ResponsiveImage, Section } from '../../Components/Public';
import RichTextContent from '../../Components/Cms/RichTextContent';
import PageSection from '../../Components/PageBuilder/PageSection';

export default function StaticPage({ settings, seo, title, page, stats = [], team = [], formsByShortcode = {} }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <Section pageHeading eyebrow="Page" title={title} subtitle={page?.seo?.description}>
                <ResponsiveImage media={page?.banner_media} src={page?.banner_path} alt={title} className="mb-8 h-80 w-full rounded-[2.5rem] object-cover" width={1400} />
                {page?.content && (
                    <Card>
                        <RichTextContent html={page.content} className="text-lg leading-8 text-muted" />
                    </Card>
                )}
                <div className="mt-8 grid gap-6">
                    {(page?.sections || []).map((section, index) => (
                        <PageSection key={section.id || `${section.type || 'content'}-${section.title || index}`} section={section} formsByShortcode={formsByShortcode} />
                    ))}
                </div>
                {stats.length > 0 && (
                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        {stats.map((stat) => (
                            <Card key={stat.id}>
                                <p className="text-3xl font-black text-primary">{stat.value}{stat.suffix}</p>
                                <p>{stat.label}</p>
                            </Card>
                        ))}
                    </div>
                )}
                {team.length > 0 && (
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {team.map((member) => (
                            <Card key={member.id}>
                                <h3 className="font-bold">{member.name}</h3>
                                <p className="text-primary">{member.position}</p>
                                <RichTextContent html={member.bio} className="mt-2 text-muted" />
                            </Card>
                        ))}
                    </div>
                )}
            </Section>
        </PublicLayout>
    );
}
