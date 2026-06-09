import PublicLayout from '../../Layouts/PublicLayout';
import { ConversionCta, FaqAccordion } from '../../Components/Public/Journey/HomeSections';
import { DevelopmentTimeline, PackageJourney, PageHero } from '../../Components/Public/Journey/PageSections';
import { Link } from '../../app';

export default function PackagesPage({ settings, seo, packages, process, faqs, contactCta }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <PageHero
                eyebrow="Engagement models"
                title="Packages designed around business outcomes"
                lead="Not a price list — a clear path for startups, growth-stage teams and enterprises building serious software."
                actions={(
                    <Link href="/quote" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">Get a custom estimate</Link>
                )}
            />
            <PackageJourney packages={packages} />
            <section className="j-section j-bg-panel">
                <div className="j-section-inner">
                    <p className="j-eyebrow">Comparison</p>
                    <h2 className="j-title">All packages include engineering quality</h2>
                    <p className="j-lead">Responsive design, SEO foundations, admin dashboard access and post-launch support — scaled to your scope.</p>
                </div>
            </section>
            <DevelopmentTimeline process={process} />
            {faqs.length > 0 && <FaqAccordion faqs={faqs} />}
            <ConversionCta section={contactCta} />
        </PublicLayout>
    );
}
