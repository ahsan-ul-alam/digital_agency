import { useEffect, useMemo, useState } from 'react';
import { Link, router, usePage } from '../../app';
import { NavIcon } from '../../Admin/icons';
import {
    getFavorites,
    getRecent,
    getSidebarCollapsed,
    setSidebarCollapsed,
    toggleFavorite,
    trackRecent,
} from '../../Admin/storage';
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiExternalLinkLine,
    RiLogoutBoxRLine,
    RiSearchLine,
    RiStarFill,
    RiStarLine,
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
    const [favorites, setFavorites] = useState(getFavorites());
    const starred = favorites.some((row) => row.key === item.key);

    function handleClick() {
        trackRecent({ ...item, group: groupTitle });
        onNavigate?.();
    }

    function handleFavorite(event) {
        event.preventDefault();
        event.stopPropagation();
        setFavorites(toggleFavorite({ ...item, group: groupTitle }));
    }

    return (
        <Link
            href={item.href}
            onClick={handleClick}
            className={`admin-nav-item ${active ? 'is-active' : ''}`}
            title={collapsed ? item.title : undefined}
        >
            <span className="admin-nav-item-icon"><NavIcon name={item.key} /></span>
            {!collapsed && (
                <>
                    <span className="admin-nav-item-label">{item.title}</span>
                    <button type="button" className="admin-nav-favorite" onClick={handleFavorite} aria-label="Toggle favorite">
                        {starred ? <RiStarFill /> : <RiStarLine />}
                    </button>
                </>
            )}
        </Link>
    );
}

export default function AdminSidebar({ navigation, onOpenCommand, onNavigate, mobile = false, collapsed: collapsedProp, onCollapsedChange }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [collapsedInternal, setCollapsedInternal] = useState(() => getSidebarCollapsed());
    const collapsed = collapsedProp ?? collapsedInternal;
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const [recent, setRecent] = useState(getFavorites().length ? [] : getRecent());
    const [favorites, setFavorites] = useState(getFavorites());

    useEffect(() => {
        const nextExpanded = {};
        navigation.forEach((group) => {
            if (group.children && isGroupActive(group, url)) {
                nextExpanded[group.key] = true;
            }
        });
        setExpanded((current) => ({ ...current, ...nextExpanded }));
        setRecent(getRecent());
        setFavorites(getFavorites());
    }, [url, navigation]);

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
                    <span className="admin-sidebar-mark">AR</span>
                    {!showCollapsed && (
                        <span className="admin-sidebar-brand-copy">
                            <strong>AR Soft BD</strong>
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
                {!search && favorites.length > 0 && !showCollapsed && (
                    <div className="admin-sidebar-section">
                        <p className="admin-sidebar-section-label">Favorites</p>
                        {favorites.map((item) => (
                            <NavItem key={`fav-${item.key}`} item={item} url={url} collapsed={showCollapsed} onNavigate={onNavigate} groupTitle={item.group} />
                        ))}
                    </div>
                )}

                {!search && recent.length > 0 && !showCollapsed && (
                    <div className="admin-sidebar-section">
                        <p className="admin-sidebar-section-label">Recent</p>
                        {recent.map((item) => (
                            <NavItem key={`recent-${item.href}`} item={item} url={url} collapsed={showCollapsed} onNavigate={onNavigate} groupTitle={item.group} />
                        ))}
                    </div>
                )}

                {filteredNavigation.map((group) => (
                    <div key={group.key} className="admin-sidebar-section">
                        {group.href ? (
                            <NavItem item={group} url={url} collapsed={showCollapsed} onNavigate={onNavigate} groupTitle="Overview" />
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className={`admin-nav-group ${isGroupActive(group, url) ? 'is-active' : ''}`}
                                    onClick={() => (showCollapsed ? router.visit(group.children[0].href) : toggleGroup(group.key))}
                                    title={showCollapsed ? group.title : undefined}
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
                                            <NavItem key={item.key} item={item} url={url} collapsed={showCollapsed} onNavigate={onNavigate} groupTitle={group.title} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                {!showCollapsed && <p className="admin-sidebar-user">{auth?.user?.name || auth?.user?.email}</p>}
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
