const FAVORITES_KEY = 'arsoftbd.admin.favorites';
const SIDEBAR_KEY = 'arsoftbd.admin.sidebar-collapsed';

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
    window.dispatchEvent(new Event('admin-nav-pins-updated'));
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
