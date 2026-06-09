import { Link } from '../../app';
import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import { RiBriefcaseLine } from 'react-icons/ri';

export default function Careers({ openings, seo }) {
    return (
        <PublicLayout seo={seo}>
            <Section pageHeading eyebrow="Careers" title="Build ambitious products with AR Soft BD" subtitle="We are a product-minded agency team shipping premium websites, SaaS platforms, and business tools.">
                {openings.length === 0 ? (
                    <Card>
                        <p className="text-muted">No open roles right now. Check back soon or send your portfolio via the <Link href="/contact" className="text-primary">contact page</Link>.</p>
                    </Card>
                ) : (
                    <div className="careers-grid">
                        {openings.map((opening) => (
                            <Link key={opening.id} href={`/careers/${opening.slug}`} className="careers-card">
                                <div className="careers-card-icon"><RiBriefcaseLine /></div>
                                <div>
                                    <h3>{opening.title}</h3>
                                    <p>{opening.department || 'General'} · {opening.location || 'Flexible'} · {opening.employment_type_label}</p>
                                    {opening.excerpt && <p className="careers-card-excerpt">{opening.excerpt}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Section>
        </PublicLayout>
    );
}
