import PublicLayout from '../../Layouts/PublicLayout';
import {
    BusinessChallenges,
    ConversionCta,
    DevelopmentTimeline,
    FaqAccordion,
    IndustryExpertise,
    JourneyHero,
    LogoStrip,
    ProductShowcase,
    ReviewsCarousel,
    SolutionEcosystem,
    StoryStats,
    SuccessStories,
    TeamCulture,
    WhyChooseComparison,
} from '../../Components/Public/Journey/HomeSections';

export default function Home({ settings, seo, sections, logos, services, stats, portfolios, testimonials, team, faqs }) {
    return (
        <PublicLayout settings={settings} seo={seo}>
            <JourneyHero section={sections.hero} stats={stats} />
            <LogoStrip logos={logos} />
            <BusinessChallenges />
            <SolutionEcosystem services={services} />
            <WhyChooseComparison why={sections.why} />
            <SuccessStories portfolios={portfolios} />
            <DevelopmentTimeline process={sections.process} />
            <IndustryExpertise />
            <ProductShowcase />
            <StoryStats stats={stats} />
            <ReviewsCarousel testimonials={testimonials} />
            <TeamCulture about={sections.about} team={team} />
            <FaqAccordion faqs={faqs} />
            <ConversionCta section={sections.contact_cta} />
        </PublicLayout>
    );
}
