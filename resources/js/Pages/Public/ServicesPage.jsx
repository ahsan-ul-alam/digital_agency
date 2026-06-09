import PublicLayout from '../../Layouts/PublicLayout';
import { ConversionCta, SuccessStories } from '../../Components/Public/Journey/HomeSections';
import {
    DevelopmentTimeline,
    PageHero,
    ProblemList,
    ServiceDeepList,
    TechStack,
} from '../../Components/Public/Journey/PageSections';
import { Link } from '../../app';

const PROBLEMS = [
    { title: 'Disconnected tools', body: 'Sales, inventory and finance live in separate spreadsheets.' },
    { title: 'No product roadmap', body: 'Features are requested reactively without a scalable architecture.' },
    { title: 'Weak digital presence', body: 'Websites look fine but do not convert or integrate with operations.' },
    { title: 'Manual reporting', body: 'Leadership waits days for numbers that should be real-time.' },
];

export default function ServicesPage({ settings, seo, services, portfolios, process, contactCta }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <PageHero
                eyebrow="Software solutions"
                title="We solve business problems through software"
                lead="From ERP and CRM to ecommerce and custom platforms — engineered for how your company actually works."
                actions={(
                    <div className="j-hero-actions">
                        <Link href="/contact" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">Discuss your challenge</Link>
                        <Link href="/portfolio" className="btn-outline rounded-full px-6 py-3 text-sm font-bold">See case studies</Link>
                    </div>
                )}
            />
            <ProblemList problems={PROBLEMS} />
            <section className="j-section j-bg-dark">
                <div className="j-section-inner">
                    <p className="j-eyebrow">Solution overview</p>
                    <h2 className="j-title">Product engineering, not page building</h2>
                    <p className="j-lead">We diagnose operational bottlenecks first, then design software that removes them — with admin tools your team can run without developers.</p>
                </div>
            </section>
            <ServiceDeepList services={services} />
            <TechStack />
            <DevelopmentTimeline process={process} />
            <SuccessStories portfolios={portfolios} />
            <ConversionCta section={contactCta} />
        </PublicLayout>
    );
}
