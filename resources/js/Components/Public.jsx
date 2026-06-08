import { Link, useForm, usePage } from '../app';
import { Input, Select, Textarea } from './Form';
import RichTextContent from './Cms/RichTextContent';
import { motion } from 'framer-motion';
import {
    RiArrowRightLine,
    RiCodeSSlashLine,
    RiFlashlightLine,
    RiNodeTree,
    RiPaletteLine,
    RiRocketLine,
    RiSearchLine,
    RiSendPlaneLine,
    RiShoppingBag3Line,
    RiSmartphoneLine,
    RiSparkling2Line,
    RiCustomerService2Line,
    RiFileList3Line,
    RiComputerLine,
} from 'react-icons/ri';

const Icons = {
    RiCodeSSlashLine,
    RiNodeTree,
    RiRocketLine,
    RiShoppingBag3Line,
    RiSparkling2Line,
    RiFlashlightLine,
    RiSmartphoneLine,
    RiPaletteLine,
    RiSearchLine,
    RiFileList3Line,
    RiComputerLine,
    RiCustomerService2Line,
};

export function ThemeStyles({ theme }) {
    if (!theme || !theme.primary) {
        return null;
    }

    const vars = {
        '--color-primary': theme.primary,
        '--color-primary-hover': theme.primary_hover,
        '--color-secondary': theme.secondary,
        '--color-accent': theme.accent,
        '--color-background': theme.background,
        '--color-surface': theme.surface,
        '--color-text': theme.text,
        '--color-text-muted': theme.text_muted,
        '--color-gradient-from': theme.gradient_from,
        '--color-gradient-via': theme.gradient_via,
        '--color-gradient-to': theme.gradient_to,
        '--color-glow-primary': theme.glow_primary,
        '--color-glow-secondary': theme.glow_secondary,
        '--color-button-text': theme.button_text,
    };

    const css = `:root { ${Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; ')} }`;

    return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function Section({ eyebrow, title, subtitle, children, className = '', action }) {
    return (
        <section className={`mx-auto max-w-7xl px-6 py-20 ${className}`}>
            {(eyebrow || title || subtitle || action) && (
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>}
                        {title && <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>}
                        {subtitle && <p className="mt-4 text-lg leading-8 text-muted">{subtitle}</p>}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}

export function Card({ children, className = '' }) {
    return <div className={`glass card-hover rounded-[2rem] p-6 transition hover:-translate-y-1 ${className}`}>{children}</div>;
}

export function ResponsiveImage({ media, src, alt = '', className = '', width = 1200 }) {
    const url = media?.secure_url || media?.url || src;
    const optimized = media?.disk === 'cloudinary' && url ? url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`) : url;

    if (!optimized) {
        return null;
    }

    return <img src={optimized} alt={alt} loading="lazy" decoding="async" className={className} />;
}

export function ResponsiveVideo({ media, src, className = '', width = 1200, poster }) {
    const url = media?.secure_url || media?.url || src;
    const optimized = media?.disk === 'cloudinary' && url
        ? url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`)
        : url;

    if (!optimized) {
        return null;
    }

    return (
        <video
            src={optimized}
            poster={poster}
            className={className}
            controls
            playsInline
            preload="metadata"
        />
    );
}

export function IconBubble({ name, className = '' }) {
    const Icon = Icons[name] || Icons.RiSparkling2Line;
    return (
        <div className={`icon-bubble mb-5 grid h-12 w-12 place-items-center rounded-2xl text-2xl ${className}`}>
            <Icon />
        </div>
    );
}

function HeroQueryForm({ services = [], formTitle, formSubtitle }) {
    const { flash } = usePage().props;
    const form = useForm({ name: '', email: '', phone: '', service: '', message: '' });

    function submit(e) {
        e.preventDefault();
        form.post('/contact', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    return (
        <div className="glass h-full w-full rounded-[2.5rem] p-6 md:p-8">
            <div className="mb-6">
                <p className="text-lg font-bold">{formTitle || 'Get a Free Quote'}</p>
                <p className="mt-2 text-sm text-muted">{formSubtitle || 'Tell us about your project and we will get back within 24 hours.'}</p>
            </div>
            {flash?.success && (
                <p className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{flash.success}</p>
            )}
            <form onSubmit={submit} className="grid gap-4">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Input
                        required
                        placeholder="Your Name *"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                    />
                    <Input
                        required
                        type="email"
                        placeholder="Email Address *"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                    />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Input
                        placeholder="Phone Number"
                        value={form.data.phone}
                        onChange={(e) => form.setData('phone', e.target.value)}
                    />
                    <Select
                        value={form.data.service}
                        onChange={(e) => form.setData('service', e.target.value)}
                    >
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </Select>
                </div>
                <Textarea
                    required
                    placeholder="Project Details *"
                    value={form.data.message}
                    onChange={(e) => form.setData('message', e.target.value)}
                />
                <button disabled={form.processing} className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60">
                    <RiSendPlaneLine />
                    {form.processing ? 'Sending...' : 'Send Inquiry'}
                </button>
            </form>
        </div>
    );
}

export function Hero({ section, stats = [], services = [] }) {
    const payload = section?.payload || {};
    const title = section?.title || '';
    const highlight = payload.highlight || '';
    const titleParts = highlight && title.includes(highlight)
        ? title.split(highlight)
        : [title, ''];

    return (
        <section className="relative isolate px-6 py-20 md:py-28">
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `linear-gradient(120deg, rgba(var(--color-glow-primary), 0.08), transparent 32%, rgba(var(--color-glow-secondary), 0.09) 68%, transparent)`,
                }}
            />
            <motion.div
                animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
                transition={{ duration: 9, repeat: Infinity }}
                className="absolute right-10 top-24 -z-10 h-64 w-64 rounded-full blur-3xl"
                style={{ background: `rgba(var(--color-glow-primary), 0.1)` }}
            />
            <motion.div
                animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
                transition={{ duration: 11, repeat: Infinity }}
                className="absolute bottom-12 left-10 -z-10 h-72 w-72 rounded-full blur-3xl"
                style={{ background: `rgba(var(--color-glow-secondary), 0.1)` }}
            />
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-grid relative mx-auto max-w-7xl"
            >
                <div className="hero-content">
                    <p className="badge-primary mb-5 inline-flex rounded-full px-4 py-2 text-sm">
                        {section?.subtitle || payload.badge || 'Software Development & Digital Agency'}
                    </p>
                    <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
                        {highlight && titleParts.length > 1 ? (
                            <>
                                {titleParts[0]}
                                <span className="text-primary">{highlight}</span>
                                {titleParts[1]}
                            </>
                        ) : (
                            <span className="gradient-text">{title}</span>
                        )}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">{section?.content}</p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link href={payload.primary_url || '/services'} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
                            {payload.primary_cta || 'Explore Services'}
                        </Link>
                        <Link href={payload.secondary_url || '/portfolio'} className="btn-outline rounded-full px-6 py-3 text-sm font-semibold">
                            {payload.secondary_cta || 'Our Portfolio'}
                        </Link>
                    </div>
                    {stats.length > 0 && (
                        <div className="hero-stats mt-10 border-t border-app pt-8">
                            {stats.slice(0, 4).map((stat) => (
                                <div key={stat.id} className="min-w-0">
                                    <p className="text-2xl font-black text-primary md:text-3xl">
                                        {stat.value}{stat.suffix}
                                    </p>
                                    <p className="mt-1 text-sm text-muted">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="hero-form-col">
                <HeroQueryForm
                    services={services}
                    formTitle={payload.form_title}
                    formSubtitle={payload.form_subtitle}
                />
                </div>
            </motion.div>
        </section>
    );
}

export function ProcessRail({ steps }) {
    const defaults = [
        { title: 'Discover', body: 'Clarify goals, workflows, users and the first high-value release.', icon: 'RiSearchLine' },
        { title: 'Plan', body: 'Shape scope, milestones, tech stack and delivery roadmap.', icon: 'RiFileList3Line' },
        { title: 'Design & Develop', body: 'Craft interfaces and build scalable Laravel/React foundations.', icon: 'RiPaletteLine' },
        { title: 'Test & Deliver', body: 'QA, performance tuning and production-ready launch.', icon: 'RiComputerLine' },
        { title: 'Support', body: 'Ongoing maintenance, analytics and feature evolution.', icon: 'RiCustomerService2Line' },
    ];

    const items = (steps && steps.length > 0) ? steps : defaults;

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {items.map((step, index) => {
                const Icon = Icons[step.icon] || Icons.RiSparkling2Line;
                return (
                    <motion.div
                        whileHover={{ y: -8 }}
                        key={step.title}
                        className="group relative rounded-[2rem] border border-white/10 bg-white/[0.035] p-6"
                    >
                        <div className="icon-bubble mb-4 grid h-11 w-11 place-items-center rounded-xl text-xl">
                            <Icon />
                        </div>
                        <p className="text-xs font-semibold text-primary">{String(index + 1).padStart(3, '0')}</p>
                        <h3 className="mt-3 text-lg font-bold group-hover:text-primary">{step.title}</h3>
                        <RichTextContent html={step.body} className="mt-3 text-sm leading-6 text-muted" />
                    </motion.div>
                );
            })}
        </div>
    );
}

export function PriceCard({ item }) {
    return (
        <Card className={item.is_highlighted ? 'border-primary bg-primary/10' : ''}>
            {item.is_highlighted && <p className="mb-4 text-sm font-semibold text-primary">Most Popular</p>}
            <h3 className="text-2xl font-bold">{item.name}</h3>
            <p className="mt-2 text-muted">{item.duration}</p>
            <p className="mt-6 text-4xl font-black">{item.price}</p>
            <ul className="mt-6 grid gap-3 text-sm text-muted">
                {(item.features || []).map((feature) => <li key={feature}>+ {feature}</li>)}
            </ul>
            <Link href={item.button_url || '/contact'} className="btn-primary mt-8 inline-flex rounded-full px-5 py-3 text-sm font-semibold">
                {item.button_text || 'Get Started'}
            </Link>
        </Card>
    );
}

export function ServiceCard({ service }) {
    return (
        <motion.article
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 card-hover"
        >
            <div
                className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl transition"
                style={{ background: `rgba(var(--color-glow-primary), 0.1)` }}
            />
            <IconBubble name={service.icon} />
            <h3 className="relative text-xl font-bold">{service.name}</h3>
            <RichTextContent html={service.excerpt} className="relative mt-4 text-sm leading-7 text-muted" />
            <Link href={`/services/${service.slug}`} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Learn More <RiArrowRightLine />
            </Link>
        </motion.article>
    );
}
