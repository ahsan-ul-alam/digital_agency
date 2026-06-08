import { useEffect, useMemo, useState } from 'react';
import { Card, ResponsiveImage } from '../Public';
import RichTextContent from '../Cms/RichTextContent';
import { Link } from '../../app';
import CarouselBlock from './CarouselBlock';
import FormBlock from './FormBlock';
import { getBlockDefinition } from './blocks';
import { gridClasses, spacerClass, wrapperClasses, wrapperStyle } from './styles';

function galleryImages(section) {
    const items = section.items || section.images || [];
    return items.map((image) => ({
        url: image.url || image.secure_url || image.file_path || '',
        alt: image.alt || image.alt_text || '',
        caption: image.caption || '',
        media: image.media || image,
    }));
}

function HeadingTag({ level, children, className }) {
    const Tag = level || 'h2';
    return <Tag className={className}>{children}</Tag>;
}

function CounterValue({ value, suffix }) {
    const target = Number.parseFloat(String(value).replace(/[^\d.]/g, '')) || 0;
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        let frame;
        const start = performance.now();
        const duration = 1200;

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            setCurrent(Math.round(target * progress));
            if (progress < 1) frame = requestAnimationFrame(tick);
        }

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target]);

    return <>{current}{suffix}</>;
}

function TabsBlock({ section, shellClass, shellStyle }) {
    const tabs = section.items || [];
    const [active, setActive] = useState(0);

    return (
        <div style={shellStyle}>
            {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
            <div className={shellClass}>
                <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                    {tabs.map((tab, tabIndex) => (
                        <button
                            key={`${tab.title}-${tabIndex}`}
                            type="button"
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${active === tabIndex ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActive(tabIndex)}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
                <RichTextContent html={tabs[active]?.body} className="mt-5 text-lg leading-8 text-muted" />
            </div>
        </div>
    );
}

export default function PageSection({ section, preview = false, formsByShortcode = {} }) {
    const type = section.type || 'content';
    const styles = { ...(section.styles || {}), ...(section.height ? { height: section.height } : {}) };
    const definition = getBlockDefinition(type);
    const shellClass = wrapperClasses(styles);
    const shellStyle = wrapperStyle(styles);
    const form = useMemo(() => formsByShortcode[section.shortcode] || null, [formsByShortcode, section.shortcode]);

    if (type === 'spacer') return <div className={spacerClass(styles)} aria-hidden="true" />;

    if (type === 'divider') {
        return <div className={wrapperClasses(styles)}><hr className="border-white/10" /></div>;
    }

    if (type === 'heading') {
        const sizes = { h1: 'text-5xl md:text-6xl', h2: 'text-4xl md:text-5xl', h3: 'text-3xl', h4: 'text-2xl', h5: 'text-xl', h6: 'text-lg' };
        return (
            <div className={shellClass} style={shellStyle}>
                <HeadingTag level={section.level || 'h2'} className={`font-black ${sizes[section.level || 'h2']}`}>{section.text}</HeadingTag>
            </div>
        );
    }

    if (type === 'text') {
        return <div className={shellClass} style={shellStyle}><RichTextContent html={section.body} className="text-lg leading-8 text-muted" /></div>;
    }

    if (type === 'button') {
        const className = section.variant === 'outline' ? 'btn-outline' : 'btn-primary';
        return (
            <div className={shellClass} style={shellStyle}>
                {preview ? <span className={`${className} inline-flex rounded-full px-6 py-3 text-sm font-bold`}>{section.label}</span> : (
                    <Link href={section.url || '/contact'} className={`${className} inline-flex rounded-full px-6 py-3 text-sm font-bold`}>{section.label}</Link>
                )}
            </div>
        );
    }

    if (type === 'image') {
        return (
            <figure className={shellClass} style={shellStyle}>
                {section.url ? <ResponsiveImage media={section.media} src={section.url} alt={section.alt || ''} className="w-full rounded-[2rem] object-cover" width={1200} /> : (
                    <div className="grid h-56 place-items-center rounded-[2rem] border border-dashed border-white/10 text-sm text-muted">Choose an image from the gallery.</div>
                )}
                {section.caption && <figcaption className="mt-3 text-sm text-muted">{section.caption}</figcaption>}
            </figure>
        );
    }

    if (type === 'video') {
        const isVideoFile = section.url?.match(/\.(mp4|webm|mov)(\?|$)/i);
        return (
            <div className={shellClass} style={shellStyle}>
                {section.url ? (
                    isVideoFile ? (
                        <video src={section.url} poster={section.poster || undefined} controls autoPlay={section.autoplay === true || section.autoplay === 'true'} className="w-full rounded-[2rem]" />
                    ) : (
                        <div className="aspect-video overflow-hidden rounded-[2rem]">
                            <iframe src={section.url} title="Video" className="h-full w-full border-0" allowFullScreen />
                        </div>
                    )
                ) : <div className="grid h-56 place-items-center rounded-[2rem] border border-dashed border-white/10 text-sm text-muted">Add a video URL or pick from gallery.</div>}
            </div>
        );
    }

    if (type === 'carousel') return <CarouselBlock section={section} shellClass={shellClass} shellStyle={shellStyle} preview={preview} />;
    if (type === 'tabs') return <TabsBlock section={section} shellClass={shellClass} shellStyle={shellStyle} />;

    if (type === 'map') {
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-4 text-3xl font-black">{section.title}</h2>}
                <div className={`overflow-hidden rounded-[2rem] ${shellClass}`}>
                    <iframe src={section.embed_url} title={section.title || 'Map'} style={{ height: `${section.height || 400}px` }} className="w-full border-0" loading="lazy" />
                </div>
            </div>
        );
    }

    if (type === 'form') {
        return (
            <div className={shellClass} style={shellStyle}>
                <FormBlock form={form} title={section.title} description={section.description} preview={preview} />
            </div>
        );
    }

    if (type === 'counter') {
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
                <div className={gridClasses(styles, 3)}>
                    {(section.items || []).map((item, index) => (
                        <Card key={`${item.label}-${index}`} className={shellClass}>
                            <p className="text-4xl font-black text-primary">
                                {preview ? <>{item.value}{item.suffix}</> : <CounterValue value={item.value} suffix={item.suffix} />}
                            </p>
                            <p className="mt-2 text-muted">{item.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'hero') {
        return (
            <div className={`${shellClass} relative overflow-hidden`} style={shellStyle}>
                <div className="glow-primary absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl" />
                <div className="relative max-w-3xl">
                    {section.eyebrow && <p className="text-sm uppercase tracking-[0.3em] text-primary">{section.eyebrow}</p>}
                    {section.title && <h2 className="mt-5 text-4xl font-black md:text-6xl">{section.title}</h2>}
                    {section.body && <RichTextContent html={section.body} className="mt-5 text-lg leading-8 text-muted" />}
                </div>
            </div>
        );
    }

    if (type === 'features') {
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
                <div className={gridClasses(styles, 3)}>
                    {(section.items || []).map((item, index) => (
                        <Card key={`${item.title || 'feature'}-${index}`} className={shellClass}>
                            <h3 className="text-xl font-bold">{item.title || item}</h3>
                            {item.body && <RichTextContent html={item.body} className="mt-3 text-muted" />}
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'gallery') {
        const images = galleryImages(section);
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
                <div className={gridClasses(styles, 3)}>
                    {images.filter((image) => image.url).map((image, index) => (
                        <figure key={`${image.url}-${index}`}>
                            <ResponsiveImage media={image.media} src={image.url} alt={image.alt} className="h-64 w-full rounded-[2rem] object-cover" width={700} />
                            {image.caption && <figcaption className="mt-2 text-sm text-muted">{image.caption}</figcaption>}
                        </figure>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'cta') {
        return (
            <div className={`${shellClass || 'cta-surface rounded-[2.5rem] p-8 md:p-10'}`} style={shellStyle}>
                {section.title && <h2 className="text-4xl font-black" style={{ color: 'var(--color-background)' }}>{section.title}</h2>}
                {section.body && <RichTextContent html={section.body} className="mt-4 max-w-2xl" style={{ color: 'color-mix(in srgb, var(--color-background) 70%, white)' }} />}
                {preview ? <span className="cta-button mt-6 inline-flex rounded-full px-5 py-3 font-bold">{section.button || 'Start now'}</span> : (
                    <Link href={section.url || '/contact'} className="cta-button mt-6 inline-flex rounded-full px-5 py-3 font-bold">{section.button || 'Start now'}</Link>
                )}
            </div>
        );
    }

    if (type === 'faq') {
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
                <div className={`divide-y divide-white/10 rounded-[2rem] border border-white/10 ${shellClass}`}>
                    {(section.items || []).map((item, index) => (
                        <details key={`${item.question}-${index}`} className="p-6" open={preview}>
                            <summary className="cursor-pointer font-bold">{item.question}</summary>
                            <RichTextContent html={item.answer} className="mt-3 text-muted" />
                        </details>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'testimonials') {
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
                <div className={gridClasses(styles, 2)}>
                    {(section.items || []).map((item, index) => (
                        <Card key={`${item.name}-${index}`} className={shellClass}>
                            <RichTextContent html={item.review} className="italic" />
                            <p className="mt-4 font-bold">{item.name}</p>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'stats') {
        return (
            <div style={shellStyle}>
                {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
                <div className={gridClasses(styles, 4)}>
                    {(section.items || []).map((item, index) => (
                        <Card key={`${item.label}-${index}`} className={shellClass}>
                            <p className="text-3xl font-black text-primary">{item.value}{item.suffix}</p>
                            <p className="mt-2 text-muted">{item.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Card className={shellClass} style={shellStyle}>
            {section.title && <h2 className="text-3xl font-black">{section.title}</h2>}
            {section.body && <RichTextContent html={section.body} className="mt-4 text-lg leading-8 text-muted" />}
            {!section.title && !section.body && preview && <p className="text-sm text-muted">{definition.label} block</p>}
        </Card>
    );
}
