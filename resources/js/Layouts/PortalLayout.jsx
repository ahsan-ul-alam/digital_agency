import { Head, Link, router, usePage } from '../app';
import { ThemeStyles } from '../Components/Public';
import { RiCalendarCheckLine, RiFileList3Line, RiHome4Line, RiLogoutBoxLine, RiReceiptLine } from 'react-icons/ri';

const NAV = [
    { href: '/portal', label: 'Dashboard', icon: RiHome4Line, exact: true },
    { href: '/portal/proposals', label: 'Proposals', icon: RiFileList3Line },
    { href: '/portal/invoices', label: 'Invoices', icon: RiReceiptLine },
    { href: '/portal/meetings', label: 'Meetings', icon: RiCalendarCheckLine },
];

export default function PortalLayout({ title, subtitle, children, actions }) {
    const { auth, theme = {}, siteBranding = {}, url } = usePage().props;
    const brand = siteBranding.name || 'AR Soft BD';
    const pathname = (url || '').split('?')[0];

    return (
        <>
            <Head title={`${title} - Client Portal`} />
            <ThemeStyles theme={theme} />
            <div className="portal-shell">
                <aside className="portal-sidebar">
                    <div className="portal-brand">
                        <strong>{brand}</strong>
                        <small>Client Portal</small>
                    </div>
                    <nav className="portal-nav">
                        {NAV.map((item) => {
                            const Icon = item.icon;
                            const active = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link key={item.href} href={item.href} className={`portal-nav-link ${active ? 'is-active' : ''}`}>
                                    <Icon /> {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="portal-sidebar-foot">
                        <div className="portal-user">
                            <strong>{auth?.user?.name}</strong>
                            <span>{auth?.user?.email}</span>
                        </div>
                        <button type="button" className="portal-logout" onClick={() => router.post('/logout')}>
                            <RiLogoutBoxLine /> Sign out
                        </button>
                    </div>
                </aside>

                <div className="portal-main">
                    <header className="portal-topbar">
                        <div>
                            <h1>{title}</h1>
                            {subtitle && <p>{subtitle}</p>}
                        </div>
                        {actions && <div className="portal-topbar-actions">{actions}</div>}
                    </header>
                    <main className="portal-content">{children}</main>
                </div>
            </div>
        </>
    );
}
