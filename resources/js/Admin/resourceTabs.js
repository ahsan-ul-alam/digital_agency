export const RESOURCE_TABS = [
    { id: 'content', title: 'Content', hint: 'Copy, structure and presentation' },
    { id: 'media', title: 'Media', hint: 'Images, banners and library assets' },
    { id: 'seo', title: 'SEO', hint: 'Search visibility and social previews' },
    { id: 'settings', title: 'Settings', hint: 'Status, visibility and ordering' },
];

const TAB_MAP = {
    media: 'media',
    seo: 'seo',
    visibility: 'settings',
    settings: 'settings',
    taxonomy: 'settings',
    advanced: 'settings',
};

export function groupSchemaSections(sections = []) {
    const buckets = {
        content: [],
        media: [],
        seo: [],
        settings: [],
    };

    sections.forEach((section) => {
        const tab = TAB_MAP[section.id] || 'content';
        buckets[tab].push(section);
    });

    return RESOURCE_TABS
        .filter((tab) => buckets[tab.id].length > 0)
        .map((tab) => ({
            ...tab,
            sections: buckets[tab.id],
        }));
}

export function previewUrlForModule(module, item) {
    if (!item?.slug && !item?.id) return null;

    const map = {
        services: `/services/${item.slug}`,
        portfolio: `/portfolio/${item.slug}`,
        blog: `/blog/${item.slug}`,
        pages: `/${item.slug}`,
        careers: `/careers/${item.slug}`,
    };

    return map[module] || null;
}
