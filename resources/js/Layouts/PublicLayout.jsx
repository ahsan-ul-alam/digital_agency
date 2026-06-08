import { useState } from 'react';
import { Head, Link, usePage } from '../app';
import AdminEditBar from '../Components/AdminEditBar';
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

export default function PublicLayout({ settings = {}, title, children }) {
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

    return (
        <>
            <Head title={title || site.name || 'AR Soft BD'}>
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <ThemeStyles theme={theme} />
            <AdminEditBar />
            <div className="min-h-screen overflow-hidden">
                <header className="public-site-header sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl" style={{ background: `color-mix(in srgb, var(--color-background) 85%, transparent)` }}>
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-3">
                            {site.logo ? (
                                <img src={site.logo} alt={site.name || 'Site logo'} className="h-10 w-auto max-w-[180px] object-contain" />
                            ) : (
                                <>
                                    <span className="btn-primary grid h-10 w-10 place-items-center rounded-2xl text-sm font-black">AR</span>
                                    <span>
                                        <span className="block text-sm font-semibold tracking-[0.28em] text-primary">{site.name || 'SOFT BD'}</span>
                                        <span className="text-xs text-muted">{site.tagline || 'Software Agency'}</span>
                                    </span>
                                </>
                            )}
                        </Link>

                        <div className="hidden items-center gap-7 text-sm text-muted lg:flex">
                            {headerItems.map((item) => (
                                <MenuLink key={item.id} item={item} className="transition hover:text-white" />
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {cta.is_active !== false && cta.label && (
                                <MenuLink
                                    item={{ ...cta, target: '_self' }}
                                    className="btn-primary hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold sm:inline-flex"
                                >
                                    <>{cta.label} <RiArrowRightLine /></>
                                </MenuLink>
                            )}
                            <button
                                type="button"
                                className="rounded-xl border border-white/10 p-2 text-xl text-muted lg:hidden"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <RiCloseLine /> : <RiMenuLine />}
                            </button>
                        </div>
                    </nav>

                    {mobileOpen && (
                        <div className="border-t border-white/10 px-6 py-4 lg:hidden">
                            <div className="grid gap-2">
                                {headerItems.map((item) => (
                                    <MenuLink
                                        key={item.id}
                                        item={item}
                                        className="rounded-xl px-4 py-3 text-sm text-muted hover:bg-white/5 hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    />
                                ))}
                                {cta.is_active !== false && cta.label && (
                                    <MenuLink
                                        item={{ ...cta, target: '_self' }}
                                        className="btn-primary mt-2 rounded-full px-4 py-3 text-center text-sm font-semibold"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {cta.label}
                                    </MenuLink>
                                )}
                            </div>
                        </div>
                    )}
                </header>
                <main>{children}</main>
                <footer className="border-t border-white/10 px-6 py-12">
                    <div className={`mx-auto grid max-w-7xl gap-8 ${footerGridClass}`}>
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
                    <p className="mx-auto mt-10 max-w-7xl text-sm text-muted">
                        {copyright || `Copyright ${new Date().getFullYear()} ${site.name || 'AR Soft BD'}. All rights reserved.`}
                    </p>
                </footer>
            </div>
        </>
    );
}
