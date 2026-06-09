import PublicLayout from '../../Layouts/PublicLayout';
import { ConversionCta } from '../../Components/Public/Journey/HomeSections';
import { PageHero, PortfolioCaseGrid, StoryStats } from '../../Components/Public/Journey/PageSections';
import { Link } from '../../app';

export default function PortfolioPage({ settings, seo, items, stats, contactCta }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <PageHero
                eyebrow="Success stories"
                title="Business transformation, not portfolio decoration"
                lead="Every project documents a challenge, the software we built, and the outcome for the client."
                actions={(
                    <Link href="/contact" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">Start your transformation</Link>
                )}
            />
            <StoryStats stats={stats} />
            <PortfolioCaseGrid items={items} />
            <ConversionCta section={contactCta} />
        </PublicLayout>
    );
}
