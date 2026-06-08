import { useState } from 'react';
import { Head, usePage } from '../app';
import { ThemeStyles } from '../Components/Public';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import AdminBreadcrumbs from '../Components/Admin/AdminBreadcrumbs';
import CommandPalette from '../Components/Admin/CommandPalette';
import { flattenNav } from '../Admin/navigation';
import { getSidebarCollapsed } from '../Admin/storage';
import { RiAddLine, RiCommandLine, RiMenuLine } from 'react-icons/ri';

export default function AdminLayout({ title, subtitle, children, actions }) {
    const { flash, adminNav, theme = {} } = usePage().props;
    const navigation = Array.isArray(adminNav) ? adminNav : [];
    const navItems = flattenNav(navigation);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => getSidebarCollapsed());

    return (
        <>
            <Head title={`${title} - Admin`} />
            <ThemeStyles theme={theme} />
            <div className={`admin-shell ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
                <AdminSidebar
                    navigation={navigation}
                    collapsed={sidebarCollapsed}
                    onCollapsedChange={setSidebarCollapsed}
                    onOpenCommand={() => setCommandOpen(true)}
                />

                {mobileOpen && (
                    <div className="admin-mobile-overlay">
                        <button type="button" className="admin-mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
                        <AdminSidebar
                            navigation={navigation}
                            mobile
                            collapsed={false}
                            onOpenCommand={() => setCommandOpen(true)}
                            onNavigate={() => setMobileOpen(false)}
                        />
                    </div>
                )}

                <div className="admin-main">
                    <header className="admin-topbar">
                        <div className="admin-topbar-left">
                            <button type="button" className="admin-topbar-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                                <RiMenuLine />
                            </button>
                            <div>
                                <AdminBreadcrumbs title={title} />
                                <h1 className="admin-topbar-title">{title}</h1>
                                {subtitle && <p className="admin-topbar-subtitle">{subtitle}</p>}
                            </div>
                        </div>
                        <div className="admin-topbar-actions">
                            <button type="button" className="admin-topbar-btn" onClick={() => setCommandOpen(true)}>
                                <RiCommandLine /> <span>Search</span> <kbd>⌘K</kbd>
                            </button>
                            {actions}
                        </div>
                    </header>

                    {flash?.success && (
                        <div className="admin-toast admin-toast-success">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="admin-toast admin-toast-error">{flash.error}</div>
                    )}

                    <div className="admin-content">{children}</div>
                </div>

                <button type="button" className="admin-fab" onClick={() => setCommandOpen(true)} aria-label="Quick actions">
                    <RiAddLine />
                </button>

                <CommandPalette open={commandOpen} onClose={setCommandOpen} items={navItems} />
            </div>
        </>
    );
}
