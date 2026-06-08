import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Hero, IconBubble, PriceCard, ProcessRail, ResponsiveImage, Section, ServiceCard } from '../../Components/Public';
import RichTextContent from '../../Components/Cms/RichTextContent';
import { Link } from '../../app';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

export default function Home({ settings, sections, logos, services, stats, portfolios, packages: plans, testimonials, team, faqs, posts }) {
    const why = sections.why || {};
    const about = sections.about || {};
    const process = sections.process || {};
    const hero = sections.hero || {};
    const serviceNames = services.map((s) => s.name);

    return (
        <PublicLayout settings={settings} title="Home">
            <Hero section={hero} stats={stats} services={serviceNames} />

            <section className="border-y border-white/10 bg-white/[0.02] py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="mb-8 text-center text-sm text-muted">Trusted by innovative companies around the world</p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {logos.map((logo) => (
                            <div key={logo.id} className="grid min-h-20 place-items-center rounded-2xl border border-white/5 bg-white/[0.02] p-4 grayscale transition hover:grayscale-0">
                                <ResponsiveImage media={logo.logo_media} src={logo.logo_path} alt={logo.name} className="max-h-8 object-contain opacity-70" width={200} />
                                {!logo.logo_path && !logo.logo_media && <span className="text-sm text-muted">{logo.name}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Section
                eyebrow="Our Services"
                title="We Provide Wide Range Of Digital Services"
                subtitle="From strategy to launch, we deliver end-to-end digital solutions tailored to your business goals."
                action={
                    <Link href="/services" className="btn-outline hidden rounded-full px-5 py-2.5 text-sm font-semibold md:inline-flex">
                        All Services
                    </Link>
                }
            >
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => <ServiceCard key={service.id} service={service} />)}
                </div>
            </Section>

            <Section eyebrow="About Company" title={about.title || why.title || 'We Are More Than Just A Development Company'} subtitle={about.subtitle || why.subtitle}>
                <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                        <RichTextContent html={about.content || why.content} className="text-lg leading-8 text-muted" />
                        <ul className="mt-8 grid gap-4">
                            {(about.payload?.features || why.payload?.features || []).map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-muted">
                                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm text-primary" style={{ background: `color-mix(in srgb, var(--color-primary) 15%, transparent)` }}>
                                        <RiCheckLine />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link href="/about" className="btn-primary mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold">
                            Learn More About Us
                        </Link>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {(about.payload?.cards || [
                                { title: 'Our Mission', body: 'Make high-quality software delivery accessible, strategic and dependable for growing businesses.' },
                                { title: 'Our Vision', body: 'Become a trusted product engineering partner for companies across Bangladesh and beyond.' },
                            ]).map((card) => (
                                <Card key={card.title}>
                                    <h3 className="text-lg font-bold text-primary">{card.title}</h3>
                                    <RichTextContent html={card.body} className="mt-3 text-sm leading-7 text-muted" />
                                </Card>
                            ))}
                        </div>
                        <Card>
                            <h3 className="text-lg font-bold">Why Choose Us?</h3>
                            <ul className="mt-4 grid gap-3">
                                {(about.payload?.why_points || ['Experienced & Professional Team', 'Quality-First Development', 'On-Time Delivery', '24/7 Support']).map((point) => (
                                    <li key={point} className="flex items-center gap-3 text-sm text-muted">
                                        <RiCheckLine className="text-primary" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section eyebrow="How We Work" title={process.title || 'Our Proven Development Process'} subtitle={process.subtitle || 'A structured approach that ensures quality delivery every time.'}>
                <ProcessRail steps={process.payload?.steps} />
            </Section>

            <Section eyebrow="Portfolio" title="Selected Work Across Web, SaaS, ERP & Ecommerce">
                <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                    {portfolios[0] && (
                        <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden rounded-[2.5rem] border border-white/10 p-1" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                            <div className="rounded-[2.25rem] bg-surface p-8">
                                {portfolios[0].image_path && (
                                    <ResponsiveImage media={portfolios[0].image_media} src={portfolios[0].image_path} alt={portfolios[0].project_name} className="mb-6 h-48 w-full rounded-2xl object-cover" width={800} />
                                )}
                                <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">{portfolios[0].category}</p>
                                <h3 className="mt-4 text-4xl font-black">{portfolios[0].project_name}</h3>
                                <p className="mt-4 max-w-xl text-lg leading-8 text-muted">{portfolios[0].excerpt}</p>
                                <Link href={`/portfolio/${portfolios[0].slug}`} className="btn-primary mt-8 inline-flex rounded-full px-5 py-3 text-sm font-bold">
                                    View Case Study
                                </Link>
                            </div>
                        </motion.div>
                    )}
                    <div className="grid gap-5">
                        {portfolios.slice(1).map((item) => (
                            <motion.div whileHover={{ x: 8 }} key={item.id} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 card-hover">
                                <p className="text-sm text-primary">{item.category}</p>
                                <h3 className="mt-3 text-2xl font-black">{item.project_name}</h3>
                                <p className="mt-3 text-muted">{item.excerpt}</p>
                                <Link href={`/portfolio/${item.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                                    Read more <RiArrowRightLine />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            <Section eyebrow="Packages" title="Transparent Pricing For Every Growth Stage">
                <div className="grid gap-5 md:grid-cols-3">{plans.map((plan) => <PriceCard key={plan.id} item={plan} />)}</div>
            </Section>

            <Section eyebrow="Testimonials" title="What Our Clients Say">
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((item) => (
                        <Card key={item.id}>
                            <RichTextContent html={item.review} className="text-lg leading-8 text-muted italic" />
                            <div className="mt-6 flex items-center gap-4">
                                <ResponsiveImage media={item.photo_media} src={item.photo_path} alt={item.client_name} className="h-12 w-12 rounded-full object-cover" width={96} />
                                <div>
                                    <p className="font-semibold">{item.client_name}</p>
                                    <p className="text-sm text-muted">{item.designation}, {item.company}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section eyebrow="Our Team" title="Meet The Experts Behind Your Success">
                <div className="grid gap-5 md:grid-cols-3">
                    {team.map((member) => (
                        <div key={member.id} className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 card-hover">
                            <ResponsiveImage media={member.photo_media} src={member.photo_path} alt={member.name} className="mb-5 h-48 w-full rounded-[1.5rem] object-cover" width={500} />
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-primary">{member.position}</p>
                            <RichTextContent html={member.bio} className="mt-3 text-sm text-muted" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section eyebrow="FAQ" title="Frequently Asked Questions">
                <div className="mx-auto max-w-4xl divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.03]">
                    {faqs.map((faq) => (
                        <details key={faq.id} className="group p-6">
                            <summary className="cursor-pointer text-lg font-bold">{faq.question}</summary>
                            <RichTextContent html={faq.answer} className="mt-4 leading-7 text-muted" />
                        </details>
                    ))}
                </div>
            </Section>

            <Section eyebrow="Blog" title="Latest Insights & Updates">
                <div className="grid gap-5 md:grid-cols-3">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            {post.thumbnail_path && (
                                <ResponsiveImage media={post.thumbnail_media} src={post.thumbnail_path} alt={post.title} className="mb-5 h-40 w-full rounded-2xl object-cover" width={600} />
                            )}
                            <h3 className="text-xl font-bold">{post.title}</h3>
                            <p className="mt-3 text-muted">{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-primary">
                                Read Article <RiArrowRightLine />
                            </Link>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section>
                <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12" style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, white), white)` }}>
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl" style={{ background: `color-mix(in srgb, var(--color-primary) 40%, transparent)` }} />
                    <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <p className="text-3xl font-black md:text-4xl" style={{ color: 'var(--color-background)' }}>{sections.contact_cta?.title}</p>
                            <RichTextContent html={sections.contact_cta?.content} className="mt-3 max-w-2xl" style={{ color: 'color-mix(in srgb, var(--color-background) 65%, white)' }} />
                        </div>
                        <Link href="/contact" className="cta-button rounded-full px-6 py-3 font-bold">
                            {sections.contact_cta?.payload?.button || 'Start a Conversation'}
                        </Link>
                    </div>
                </div>
            </Section>
        </PublicLayout>
    );
}
