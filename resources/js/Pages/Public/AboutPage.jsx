import PublicLayout from '../../Layouts/PublicLayout';
import { ConversionCta } from '../../Components/Public/Journey/HomeSections';
import { AboutJourney, PageHero } from '../../Components/Public/Journey/PageSections';
import { Link } from '../../app';

export default function AboutPage({ settings, seo, page, stats, team, sections, contactCta }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <PageHero
                eyebrow="About AR Soft BD"
                title="A software company obsessed with business outcomes"
                lead="We exist to help organizations replace manual chaos with scalable digital products."
                actions={(
                    <Link href="/contact" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">Work with us</Link>
                )}
            />
            <AboutJourney page={page} stats={stats} team={team} sections={sections} />
            <ConversionCta section={contactCta} />
        </PublicLayout>
    );
}
