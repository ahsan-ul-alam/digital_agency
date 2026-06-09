import PublicLayout from '../../Layouts/PublicLayout';
import { Card, IconBubble, PriceCard, Section } from '../../Components/Public';
import RichTextContent from '../../Components/Cms/RichTextContent';
import { Link } from '../../app';

function categoryLabel(item) {
    if (item.category?.name) return item.category.name;
    if (typeof item.category === 'string') return item.category;
    return item.type || null;
}

export default function Listing({ settings, seo, kind, title, items }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <Section pageHeading eyebrow={kind} title={title} subtitle="Filtered, dynamic and manageable from the AR Soft BD dashboard.">
                <div className="grid gap-5 md:grid-cols-3">
                    {items.map((item) => {
                        if (kind === 'packages') {
                            return <PriceCard key={item.id} item={item} />;
                        }

                        const label = categoryLabel(item);

                        return (
                            <Card key={item.id}>
                                {item.icon && <IconBubble name={item.icon} />}
                                {label && <p className="text-sm text-primary">{label}</p>}
                                <h3 className="mt-3 text-2xl font-bold">{item.name || item.project_name || item.title}</h3>
                                <RichTextContent html={item.excerpt || item.description} className="mt-3 text-muted" />
                                {item.slug && <Link href={`/${kind === 'portfolio' ? 'portfolio' : kind}/${item.slug}`} className="mt-5 inline-flex text-primary">View details</Link>}
                            </Card>
                        );
                    })}
                </div>
            </Section>
        </PublicLayout>
    );
}
