import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, router, usePage } from '../../app';
import { NavIcon } from '../../Admin/icons';
import { getFavorites, getSidebarCollapsed, setSidebarCollapsed } from '../../Admin/storage';
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiExternalLinkLine,
    RiLogoutBoxRLine,
    RiSearchLine,
} from 'react-icons/ri';

function isActive(href, currentUrl) {
    if (!currentUrl) return false;
    if (href === '/admin') return currentUrl === '/admin' || currentUrl === '/admin/';
    return currentUrl === href || currentUrl.startsWith(`${href}/`);
}

function isGroupActive(group, url) {
    if (group.href) return isActive(group.href, url);
    return (group.children || []).some((item) => isActive(item.href, url));
}

function NavItem({ item, url, collapsed, onNavigate, groupTitle }) {
    const active = isActive(item.href, url);

    return (
        <Link
            href={item.href}
            onClick={() => onNavigate?.()}
            className={`admin-nav-item ${active ? 'is-active' : ''}`}
            title={collapsed ? item.title : undefined}
        >
            <span className="admin-nav-item-icon"><NavIcon name={item.key} /></span>
            {!collapsed && <span className="admin-nav-item-label">{item.title}</span>}
        </Link>
    );
}

export default function AdminSidebar({ navigation, onOpenCommand, onNavigate, mobile = false, collapsed: collapsedProp, onCollapsedChange }) {
    const { url, siteBranding = {} } = usePage().props;
    const { auth } = usePage().props;
    const [collapsedInternal, setCollapsedInternal] = useState(() => getSidebarCollapsed());
    const collapsed = collapsedProp ?? collapsedInternal;
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const [favorites, setFavorites] = useState(() => getFavorites());

    const siteName = siteBranding.name || 'AR Soft BD';
    const siteLogo = siteBranding.logo || '';

    useEffect(() => {
        const nextExpanded = {};
        navigation.forEach((group) => {
            if (group.children && isGroupActive(group, url)) {
                nextExpanded[group.key] = true;
            }
        });
        setExpanded((current) => ({ ...current, ...nextExpanded }));
        setFavorites(getFavorites());
    }, [url, navigation]);

    useEffect(() => {
        function refreshPins() {
            setFavorites(getFavorites());
        }
        window.addEventListener('admin-nav-pins-updated', refreshPins);
        return () => window.removeEventListener('admin-nav-pins-updated', refreshPins);
    }, []);

    const filteredNavigation = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return navigation;
        return navigation
            .map((group) => {
                if (group.href) {
                    return [group.title, group.description].join(' ').toLowerCase().includes(q) ? group : null;
                }
                const children = (group.children || []).filter((item) =>
                    [item.title, item.description, group.title].join(' ').toLowerCase().includes(q)
                );
                return children.length ? { ...group, children } : null;
            })
            .filter(Boolean);
    }, [navigation, search]);

    function toggleCollapsed() {
        const next = !collapsed;
        setCollapsedInternal(next);
        setSidebarCollapsed(next);
        onCollapsedChange?.(next);
    }

    function toggleGroup(key) {
        setExpanded((current) => ({ ...current, [key]: !current[key] }));
    }

    const showCollapsed = collapsed && !mobile;

    return (
        <aside className={`admin-sidebar ${showCollapsed ? 'is-collapsed' : ''} ${mobile ? 'is-mobile' : ''}`}>
            <div className="admin-sidebar-brand">
                <Link href="/admin" className="admin-sidebar-logo" onClick={onNavigate}>
                    {siteLogo ? (
                        <img src={siteLogo} alt={siteName} className="admin-sidebar-logo-image" />
                    ) : (
                        <span className="admin-sidebar-mark">AR</span>
                    )}
                    {!showCollapsed && (
                        <span className="admin-sidebar-brand-copy">
                            <strong>{siteName}</strong>
                            <small>Agency Console</small>
                        </span>
                    )}
                </Link>
                {!mobile && (
                    <button type="button" className="admin-sidebar-collapse" onClick={toggleCollapsed} aria-label="Toggle sidebar">
                        {showCollapsed ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
                    </button>
                )}
            </div>

            {!showCollapsed && (
                <div className="admin-sidebar-search">
                    <RiSearchLine />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter menu..."
                        onFocus={() => onOpenCommand?.()}
                    />
                    <button type="button" className="admin-sidebar-kbd" onClick={() => onOpenCommand?.()}>⌘K</button>
                </div>
            )}

            {showCollapsed && (
                <button type="button" className="admin-sidebar-icon-btn" onClick={() => onOpenCommand?.()} title="Search (Ctrl+K)">
                    <RiSearchLine />
                </button>
            )}

            <nav className="admin-sidebar-nav">
                {!showCollapsed && favorites.length > 0 && (
                    <div className="admin-sidebar-pins">
                        <p className="admin-sidebar-zone-label">Favorites</p>
                        {favorites.map((item) => (
                            <NavItem key={`fav-${item.key}`} item={item} url={url} collapsed={showCollapsed} onNavigate={onNavigate} groupTitle="Favorites" />
                        ))}
                    </div>
                )}

                {filteredNavigation.map((group, index) => {
                    const previous = filteredNavigation[index - 1];
                    const showZone = !showCollapsed && group.zone && group.zone !== previous?.zone;

                    return (
                        <Fragment key={group.key}>
                            {showZone && <p className="admin-sidebar-zone-label">{group.zone}</p>}
                            <div className={`admin-sidebar-section ${group.href ? 'is-single' : 'is-group'}`}>
                                {group.href ? (
                                    <NavItem item={group} url={url} collapsed={showCollapsed} onNavigate={onNavigate} groupTitle={group.title} />
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={`admin-nav-group ${isGroupActive(group, url) ? 'is-active' : ''}`}
                                            onClick={() => {
                                                if (showCollapsed) {
                                                    router.visit(group.children[0].href);
                                                    return;
                                                }
                                                toggleGroup(group.key);
                                            }}
                                            title={showCollapsed ? group.title : undefined}
                                            aria-expanded={!showCollapsed ? Boolean(expanded[group.key]) : undefined}
                                        >
                                            <span className="admin-nav-item-icon"><NavIcon name={group.icon || group.key} /></span>
                                            {!showCollapsed && (
                                                <>
                                                    <span className="admin-nav-item-label">{group.title}</span>
                                                    <RiArrowRightSLine className={`admin-nav-chevron ${expanded[group.key] ? 'is-open' : ''}`} />
                                                </>
                                            )}
                                        </button>
                                        {!showCollapsed && expanded[group.key] && (
                                            <div className="admin-nav-children">
                                                {group.children.map((item) => (
                                                    <NavItem
                                                        key={item.key}
                                                        item={item}
                                                        url={url}
                                                        collapsed={showCollapsed}
                                                        onNavigate={onNavigate}
                                                        groupTitle={group.title}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </Fragment>
                    );
                })}
            </nav>

            <div className="admin-sidebar-footer">
                {!showCollapsed && (
                    <p className="admin-sidebar-user">
                        {auth?.user?.name || auth?.user?.email}
                        {auth?.user?.role?.name && <small>{auth.user.role.name}</small>}
                    </p>
                )}
                <div className="admin-sidebar-footer-actions">
                    <Link href="/" target="_blank" className="admin-sidebar-footer-btn" title="View website">
                        <RiExternalLinkLine />
                        {!showCollapsed && <span>Website</span>}
                    </Link>
                    <button type="button" className="admin-sidebar-footer-btn" onClick={() => router.post('/logout')} title="Logout">
                        <RiLogoutBoxRLine />
                        {!showCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
