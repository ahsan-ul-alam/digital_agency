import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, usePage } from '../app';
import AdminEditBar from '../Components/AdminEditBar';
import SeoHead from '../Components/SeoHead';
import { ThemeStyles } from '../Components/Public';
import {
    RiArrowRightLine,
    RiCloseLine,
    RiFacebookFill,
    RiGithubFill,
    RiInstagramFill,
    RiLinkedinFill,
    RiMenuLine,
    RiTwitterXFill,
} from 'react-icons/ri';

const socialIcons = {
    facebook: RiFacebookFill,
    linkedin: RiLinkedinFill,
    github: RiGithubFill,
    twitter: RiTwitterXFill,
    instagram: RiInstagramFill,
};

function isSocialActive(url) {
    return typeof url === 'string' && url.trim() !== '';
}

function FooterSocial({ social }) {
    const links = Object.entries(social).filter(([, url]) => isSocialActive(url));
    if (links.length === 0) return null;

    return (
        <div className="footer-social">
            {links.map(([name, url]) => {
                const Icon = socialIcons[name] || RiGithubFill;
                const isExternal = url.startsWith('http');
                return (
                    <a
                        key={name}
                        href={url}
                        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="footer-social-link"
                        aria-label={name}
                        title={name}
                    >
                        <Icon />
                    </a>
                );
            })}
        </div>
    );
}

function activeItems(items = []) {
    return items.filter((item) => item.is_active !== false);
}

function MenuLink({ item, className, onClick, children }) {
    const isExternal = item.url?.startsWith('http') || item.target === '_blank';
    const content = children ?? item.label;

    if (isExternal) {
        return (
            <a href={item.url} target={item.target || '_blank'} rel="noreferrer" className={className} onClick={onClick}>
                {content}
            </a>
        );
    }

    return (
        <Link href={item.url || '/'} className={className} onClick={onClick}>
            {content}
        </Link>
    );
}

export default function PublicLayout({ settings = {}, seo, title, children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { siteBranding = {}, theme: sharedTheme = {}, menus: sharedMenus = {} } = usePage().props;
    const site = { ...siteBranding, ...(settings.site || {}) };
    const contact = settings.contact || {};
    const social = settings.social || {};
    const theme = { ...sharedTheme, ...(settings.theme || {}) };

    const headerItems = activeItems(sharedMenus.header?.items);
    const cta = sharedMenus.header?.cta || {};
    const footerColumns = (sharedMenus.footer?.columns || []).map((column) => ({
        ...column,
        items: activeItems(column.items),
    })).filter((column) => column.items.length > 0);
    const showLogo = sharedMenus.footer?.show_logo !== false;
    const showContact = sharedMenus.footer?.show_contact !== false;
    const showSocial = sharedMenus.footer?.show_social !== false;
    const copyright = sharedMenus.footer?.copyright?.trim();
    const hasSocial = showSocial && Object.values(social).some(isSocialActive);

    const footerGridClass = footerColumns.length >= 2
        ? 'md:grid-cols-2 xl:grid-cols-4'
        : 'md:grid-cols-2 lg:grid-cols-3';

    const closeMobileMenu = () => setMobileOpen(false);

    useEffect(() => {
        if (!mobileOpen) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.body.style.overflow = 'hidden';
        document.body.classList.add('public-nav-open');
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('public-nav-open');
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [mobileOpen]);

    const mobileDrawer = mobileOpen ? (
        <div className="public-nav-drawer-overlay">
            <button
                type="button"
                className="public-nav-drawer-backdrop"
                onClick={closeMobileMenu}
                aria-label="Close menu"
            />
            <aside
                id="public-nav-drawer"
                className="public-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
            >
                <div className="public-nav-drawer-shell">
                    <header className="public-nav-drawer-head">
                        <Link href="/" className="public-nav-drawer-logo" onClick={closeMobileMenu}>
                            {site.logo ? (
                                <img
                                    src={site.logo}
                                    alt={site.name || 'Site logo'}
                                    className="public-site-logo-img"
                                />
                            ) : (
                                <>
                                    <span className="public-site-logo-mark">AR</span>
                                    <span className="public-site-logo-name">{site.name || 'SOFT BD'}</span>
                                </>
                            )}
                        </Link>
                        <button
                            type="button"
                            className="public-nav-drawer-close"
                            onClick={closeMobileMenu}
                            aria-label="Close menu"
                        >
                            <RiCloseLine />
                        </button>
                    </header>

                    <div className="public-nav-drawer-scroll">
                        <p className="public-nav-drawer-eyebrow">Navigation</p>
                        <nav className="public-nav-drawer-links">
                            {headerItems.map((item) => (
                                <MenuLink
                                    key={item.id}
                                    item={item}
                                    className="public-nav-drawer-item"
                                    onClick={closeMobileMenu}
                                />
                            ))}
                        </nav>
                    </div>

                    {cta.is_active !== false && cta.label && (
                        <footer className="public-nav-drawer-footer">
                            <MenuLink
                                item={{ ...cta, target: '_self' }}
                                className="public-nav-drawer-cta sw-btn sw-btn-primary"
                                onClick={closeMobileMenu}
                            >
                                <>{cta.label} <RiArrowRightLine /></>
                            </MenuLink>
                        </footer>
                    )}
                </div>
            </aside>
        </div>
    ) : null;

    return (
        <>
            <SeoHead seo={seo} />
            {site.favicon && (
                <Head>
                    <link rel="icon" href={site.favicon} />
                </Head>
            )}
            <ThemeStyles theme={theme} />
            <div className="min-h-screen overflow-hidden">
                <div className="public-site-chrome">
                    <AdminEditBar />
                    <header
                        className={`public-site-header w-full border-b border-white/10 backdrop-blur-xl${mobileOpen ? ' is-menu-open' : ''}`}
                        style={{ background: `color-mix(in srgb, var(--color-background) 85%, transparent)` }}
                    >
                        <nav className="public-site-nav site-container flex items-center justify-between gap-3">
                            <Link href="/" className="public-site-logo" onClick={mobileOpen ? closeMobileMenu : undefined}>
                                {site.logo ? (
                                    <img
                                        src={site.logo}
                                        alt={site.name || 'Site logo'}
                                        className="public-site-logo-img"
                                    />
                                ) : (
                                    <>
                                        <span className="public-site-logo-mark">AR</span>
                                        <span className="public-site-logo-text">
                                            <span className="public-site-logo-name">{site.name || 'SOFT BD'}</span>
                                            <span className="public-site-logo-tagline">{site.tagline || 'Software Agency'}</span>
                                        </span>
                                    </>
                                )}
                            </Link>

                            <div className="public-site-nav-links min-w-0 flex-1 items-center justify-center gap-4 text-sm text-muted xl:gap-6">
                                {headerItems.map((item) => (
                                    <MenuLink key={item.id} item={item} className="whitespace-nowrap transition hover:text-white" />
                                ))}
                            </div>

                            <div className="public-site-nav-actions flex shrink-0 items-center">
                                {cta.is_active !== false && cta.label && (
                                    <MenuLink
                                        item={{ ...cta, target: '_self' }}
                                        className="public-site-header-cta sw-btn sw-btn-primary"
                                    >
                                        <>{cta.label} <RiArrowRightLine /></>
                                    </MenuLink>
                                )}
                                <button
                                    type="button"
                                    className="public-nav-toggle"
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                                    aria-expanded={mobileOpen}
                                    aria-controls="public-nav-drawer"
                                >
                                    {mobileOpen ? <RiCloseLine /> : <RiMenuLine />}
                                </button>
                            </div>
                        </nav>
                    </header>
                </div>

                {typeof document !== 'undefined' && mobileDrawer
                    ? createPortal(mobileDrawer, document.body)
                    : null}
                <main>{children}</main>
                <footer className="border-t border-white/10 py-12">
                    <div className={`site-container grid gap-8 ${footerGridClass}`}>
                        <div className="footer-brand">
                            {showLogo && site.logo ? (
                                <Link href="/" className="inline-flex">
                                    <img src={site.logo} alt={site.name || 'Site logo'} className="h-10 w-auto max-w-[180px] object-contain" />
                                </Link>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold">{site.name || 'AR Soft BD'}</h3>
                                    {site.tagline && <p className="mt-3 max-w-xl text-muted">{site.tagline}</p>}
                                </>
                            )}
                            {hasSocial && <FooterSocial social={social} />}
                        </div>

                        {footerColumns.map((column) => (
                            <div key={column.id}>
                                <p className="font-semibold">{column.title}</p>
                                <div className="mt-3 grid gap-2 text-sm text-muted">
                                    {column.items.map((item) => (
                                        <MenuLink key={item.id} item={item} className="hover:text-white" />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {showContact && (
                            <div>
                                <p className="font-semibold">Contact</p>
                                <div className="mt-3 grid gap-2 text-sm text-muted">
                                    {contact.email && <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>}
                                    {contact.phone && <span>{contact.phone}</span>}
                                    {contact.address && <span>{contact.address}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="site-container mt-10 text-sm text-muted">
                        {copyright || `Copyright ${new Date().getFullYear()} ${site.name || 'AR Soft BD'}. All rights reserved.`}
                    </p>
                </footer>
            </div>
        </>
    );
}
