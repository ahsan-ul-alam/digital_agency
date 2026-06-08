const RECENT_KEY = 'arsoftbd.admin.recent';
const FAVORITES_KEY = 'arsoftbd.admin.favorites';
const SIDEBAR_KEY = 'arsoftbd.admin.sidebar-collapsed';
const MAX_RECENT = 6;

export function getRecent() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch {
        return [];
    }
}

export function trackRecent(item) {
    if (!item?.href) return;
    const entry = { key: item.key, title: item.title, href: item.href, group: item.group || '' };
    const next = [entry, ...getRecent().filter((row) => row.href !== entry.href)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch {
        return [];
    }
}

export function toggleFavorite(item) {
    if (!item?.key) return getFavorites();
    const favorites = getFavorites();
    const exists = favorites.some((row) => row.key === item.key);
    const next = exists
        ? favorites.filter((row) => row.key !== item.key)
        : [{ key: item.key, title: item.title, href: item.href, group: item.group || '' }, ...favorites];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return next;
}

export function isFavorite(key) {
    return getFavorites().some((row) => row.key === key);
}

export function getSidebarCollapsed() {
    return localStorage.getItem(SIDEBAR_KEY) === '1';
}

export function setSidebarCollapsed(collapsed) {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
}
