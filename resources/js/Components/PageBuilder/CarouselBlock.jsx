import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ResponsiveImage } from '../Public';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { radiusMap, wrapperClasses } from './styles';

const heightMap = {
    sm: '240px',
    md: '320px',
    lg: '420px',
    xl: '520px',
    full: '70vh',
};

const speedMap = {
    slow: 0.8,
    normal: 0.5,
    fast: 0.3,
};

const motionPresets = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slide: {
        initial: { opacity: 0, x: 72 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -72 },
    },
    'slide-up': {
        initial: { opacity: 0, y: 48 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -48 },
    },
    zoom: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.08 },
    },
    'ken-burns': {
        initial: { opacity: 0, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
    },
};

function galleryImages(section) {
    const items = section.items || section.images || [];
    return items.map((image) => ({
        url: image.url || image.secure_url || image.file_path || '',
        alt: image.alt || image.alt_text || '',
        caption: image.caption || '',
        media: image.media || image,
    }));
}

function carouselHeight(styles = {}) {
    if (styles.height === 'custom' && styles.custom_height) {
        const value = Number.parseInt(String(styles.custom_height), 10);
        return `${Number.isFinite(value) && value > 0 ? value : 400}px`;
    }
    return heightMap[styles.height] || heightMap.lg;
}

function isEnabled(value, fallback = true) {
    if (value === undefined || value === null || value === '') return fallback;
    return value === true || value === 'true';
}

export default function CarouselBlock({ section, shellClass, shellStyle, preview = false }) {
    const slides = useMemo(() => galleryImages(section).filter((slide) => slide.url), [section]);
    const styles = section.styles || {};
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const animation = styles.animation || section.animation || 'fade';
    const transition = speedMap[styles.animation_speed || section.animation_speed] || speedMap.normal;
    const imageFit = styles.image_fit || section.image_fit || 'cover';
    const showArrows = isEnabled(section.show_arrows, true);
    const showDots = isEnabled(section.show_dots, true);
    const autoplay = isEnabled(section.autoplay, true);
    const pauseOnHover = isEnabled(section.pause_on_hover, true);
    const intervalMs = (Number.parseInt(String(section.interval || styles.interval || 5), 10) || 5) * 1000;
    const height = carouselHeight(styles);
    const radiusClass = radiusMap[styles.borderRadius] || radiusMap['2xl'];

    useEffect(() => {
        setIndex((current) => (slides.length === 0 ? 0 : Math.min(current, slides.length - 1)));
    }, [slides.length]);

    useEffect(() => {
        if (slides.length < 2 || !autoplay || (pauseOnHover && paused)) return undefined;
        const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), intervalMs);
        return () => clearInterval(timer);
    }, [slides.length, autoplay, pauseOnHover, paused, intervalMs]);

    if (slides.length === 0) {
        return <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-muted">Add slides from the media gallery.</div>;
    }

    const active = slides[index % slides.length];
    const preset = motionPresets[animation] || motionPresets.fade;
    const shell = wrapperClasses(styles);

    function go(direction) {
        setIndex((current) => (current + direction + slides.length) % slides.length);
    }

    return (
        <div style={shellStyle} onMouseEnter={() => pauseOnHover && setPaused(true)} onMouseLeave={() => pauseOnHover && setPaused(false)}>
            {section.title && <h2 className="mb-6 text-3xl font-black">{section.title}</h2>}
            <div className={`${shellClass || shell} carousel-shell relative overflow-hidden ${radiusClass}`} style={{ height }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={`${active.url}-${index}`}
                        className={`carousel-slide absolute inset-0 ${animation === 'ken-burns' ? 'carousel-ken-burns' : ''}`}
                        initial={preset.initial}
                        animate={preset.animate}
                        exit={preset.exit}
                        transition={{ duration: transition, ease: 'easeInOut' }}
                    >
                        <ResponsiveImage
                            media={active.media}
                            src={active.url}
                            alt={active.alt}
                            className={`h-full w-full ${imageFit === 'contain' ? 'object-contain bg-black/20' : 'object-cover'}`}
                            width={1400}
                        />
                    </motion.div>
                </AnimatePresence>

                {active.caption && (
                    <div className="carousel-caption absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-10 text-sm text-white">
                        {active.caption}
                    </div>
                )}

                {slides.length > 1 && showArrows && (
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3">
                        <button
                            type="button"
                            className="carousel-nav pointer-events-auto"
                            onClick={() => go(-1)}
                            aria-label="Previous slide"
                        >
                            <RiArrowLeftLine />
                        </button>
                        <button
                            type="button"
                            className="carousel-nav pointer-events-auto"
                            onClick={() => go(1)}
                            aria-label="Next slide"
                        >
                            <RiArrowRightLine />
                        </button>
                    </div>
                )}

                {slides.length > 1 && showDots && (
                    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                        {slides.map((slide, dotIndex) => (
                            <button
                                key={`${slide.url}-${dotIndex}`}
                                type="button"
                                className={`carousel-dot ${dotIndex === index ? 'is-active' : ''}`}
                                onClick={() => setIndex(dotIndex)}
                                aria-label={`Go to slide ${dotIndex + 1}`}
                            />
                        ))}
                    </div>
                )}

                {preview && slides.length > 1 && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                        {animation} · {Math.round(transition * 1000)}ms
                    </div>
                )}
            </div>
        </div>
    );
}
