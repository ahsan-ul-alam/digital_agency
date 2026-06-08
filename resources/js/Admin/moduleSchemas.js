const visibility = (extra = []) => ({
    id: 'visibility',
    title: 'Visibility',
    description: 'Control whether this item appears on the public website.',
    fields: extra,
});

export const moduleSchemas = {
    homepage: {
        sections: [
            {
                id: 'content',
                title: 'Section Content',
                description: 'Headline, supporting copy and display order for this homepage block.',
                fields: [
                    { key: 'section_key', type: 'readonly', label: 'Section Key' },
                    { key: 'title', type: 'text', label: 'Heading', required: true, wide: true },
                    { key: 'subtitle', type: 'text', label: 'Subheading', wide: true },
                    { key: 'content', type: 'richtext', label: 'Body Copy', wide: true },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                    { key: 'is_active', type: 'toggle', label: 'Published on homepage', hint: 'Turn off to hide without deleting.' },
                ],
            },
            {
                id: 'advanced',
                title: 'Section Settings',
                description: 'Buttons, cards, process steps and other structured content.',
                fields: [{ key: 'payload', type: 'homepage_payload' }],
            },
        ],
    },
    logos: {
        sections: [
            {
                id: 'brand',
                title: 'Client Logo',
                description: 'Trusted-by logos shown below the homepage hero.',
                fields: [
                    { key: 'name', type: 'text', label: 'Company Name', required: true },
                    { key: 'logo_path', type: 'media', label: 'Logo Image', mediaKey: 'logo_media', wide: true },
                    { key: 'url', type: 'text', label: 'Website URL', hint: 'Optional link when visitors click the logo.' },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                    { key: 'is_active', type: 'toggle', label: 'Visible on homepage' },
                ],
            },
        ],
    },
    statistics: {
        sections: [
            {
                id: 'stat',
                title: 'Statistic',
                description: 'Counter values displayed in the hero stats row.',
                fields: [
                    { key: 'label', type: 'text', label: 'Label', required: true },
                    { key: 'value', type: 'number', label: 'Value', required: true },
                    { key: 'suffix', type: 'text', label: 'Suffix', hint: 'e.g. + or %' },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                    { key: 'is_active', type: 'toggle', label: 'Visible on site' },
                ],
            },
        ],
    },
    services: {
        sections: [
            {
                id: 'basics',
                title: 'Service Details',
                description: 'Name, URL and icon shown on cards and detail pages.',
                fields: [
                    { key: 'name', type: 'text', label: 'Service Name', required: true },
                    { key: 'slug', type: 'slug', source: 'name', label: 'URL Slug' },
                    { key: 'icon', type: 'text', label: 'Icon', hint: 'Remix icon name, e.g. RiCodeSSlashLine' },
                    { key: 'excerpt', type: 'richtext', label: 'Card Summary', wide: true, compact: true },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                ],
            },
            {
                id: 'content',
                title: 'Full Description',
                fields: [
                    { key: 'description', type: 'richtext', label: 'Detailed Description', wide: true },
                    { key: 'benefits', type: 'list', label: 'Key Benefits', wide: true },
                ],
            },
            {
                id: 'media',
                title: 'Banner',
                fields: [{ key: 'banner_path', type: 'media', label: 'Banner Image', mediaKey: 'banner_media', wide: true }],
            },
            {
                id: 'seo',
                title: 'SEO',
                fields: [{ key: 'seo', type: 'seo' }],
            },
            visibility([
                { key: 'is_active', type: 'toggle', label: 'Published' },
                { key: 'is_featured', type: 'toggle', label: 'Featured on homepage' },
            ]),
        ],
    },
    portfolio: {
        sections: [
            {
                id: 'project',
                title: 'Project Overview',
                fields: [
                    { key: 'project_name', type: 'text', label: 'Project Name', required: true },
                    { key: 'slug', type: 'slug', source: 'project_name', label: 'URL Slug' },
                    { key: 'client', type: 'text', label: 'Client' },
                    { key: 'category', type: 'text', label: 'Category' },
                    { key: 'url', type: 'text', label: 'Live Project URL' },
                    { key: 'excerpt', type: 'richtext', label: 'Card Summary', wide: true, compact: true },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                ],
            },
            {
                id: 'story',
                title: 'Case Study',
                fields: [{ key: 'description', type: 'richtext', label: 'Project Story', wide: true }],
            },
            {
                id: 'media',
                title: 'Cover Image',
                fields: [{ key: 'image_path', type: 'media', label: 'Project Image', mediaKey: 'image_media', wide: true }],
            },
            {
                id: 'seo',
                title: 'SEO',
                fields: [{ key: 'seo', type: 'seo' }],
            },
            visibility([
                { key: 'is_active', type: 'toggle', label: 'Published' },
                { key: 'is_featured', type: 'toggle', label: 'Featured on homepage' },
            ]),
        ],
    },
    packages: {
        sections: [
            {
                id: 'plan',
                title: 'Package Details',
                fields: [
                    { key: 'name', type: 'text', label: 'Package Name', required: true },
                    { key: 'type', type: 'select', label: 'Billing Type', options: [['one-time', 'One-time'], ['monthly', 'Monthly'], ['yearly', 'Yearly']] },
                    { key: 'price', type: 'text', label: 'Price Label', hint: 'e.g. BDT 95,000' },
                    { key: 'duration', type: 'text', label: 'Delivery Time' },
                    { key: 'button_text', type: 'text', label: 'CTA Button Label' },
                    { key: 'button_url', type: 'text', label: 'CTA Button URL' },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                ],
            },
            {
                id: 'features',
                title: 'Included Features',
                fields: [{ key: 'features', type: 'list', label: 'Plan Features', wide: true }],
            },
            visibility([
                { key: 'is_active', type: 'toggle', label: 'Published' },
                { key: 'is_highlighted', type: 'toggle', label: 'Highlighted plan' },
            ]),
        ],
    },
    testimonials: {
        sections: [
            {
                id: 'client',
                title: 'Client Details',
                fields: [
                    { key: 'client_name', type: 'text', label: 'Client Name', required: true },
                    { key: 'designation', type: 'text', label: 'Role / Title' },
                    { key: 'company', type: 'text', label: 'Company' },
                    { key: 'rating', type: 'rating', label: 'Star Rating' },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                ],
            },
            {
                id: 'review',
                title: 'Testimonial',
                fields: [
                    { key: 'review', type: 'richtext', label: 'Review Text', wide: true },
                    { key: 'photo_path', type: 'media', label: 'Client Photo', mediaKey: 'photo_media', wide: true },
                ],
            },
            visibility([{ key: 'is_active', type: 'toggle', label: 'Visible on homepage' }]),
        ],
    },
    team: {
        sections: [
            {
                id: 'profile',
                title: 'Team Member',
                fields: [
                    { key: 'name', type: 'text', label: 'Full Name', required: true },
                    { key: 'position', type: 'text', label: 'Position' },
                    { key: 'bio', type: 'richtext', label: 'Short Bio', wide: true, compact: true },
                    { key: 'photo_path', type: 'media', label: 'Profile Photo', mediaKey: 'photo_media', wide: true },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                ],
            },
            {
                id: 'social',
                title: 'Social Profiles',
                fields: [{ key: 'social_links', type: 'social' }],
            },
            visibility([{ key: 'is_active', type: 'toggle', label: 'Visible on site' }]),
        ],
    },
    faqs: {
        sections: [
            {
                id: 'faq',
                title: 'FAQ Entry',
                fields: [
                    { key: 'question', type: 'text', label: 'Question', required: true, wide: true },
                    { key: 'answer', type: 'richtext', label: 'Answer', wide: true },
                    { key: 'category', type: 'text', label: 'Category' },
                    { key: 'sort_order', type: 'number', label: 'Display Order' },
                    { key: 'is_active', type: 'toggle', label: 'Published on homepage' },
                ],
            },
        ],
    },
    categories: {
        sections: [
            {
                id: 'category',
                title: 'Blog Category',
                fields: [
                    { key: 'name', type: 'text', label: 'Category Name', required: true },
                    { key: 'slug', type: 'slug', source: 'name', label: 'URL Slug' },
                ],
            },
        ],
    },
    blog: {
        sections: [
            {
                id: 'post',
                title: 'Post Details',
                fields: [
                    { key: 'title', type: 'text', label: 'Post Title', required: true, wide: true },
                    { key: 'slug', type: 'slug', source: 'title', label: 'URL Slug' },
                    { key: 'blog_category_id', type: 'category', label: 'Category' },
                    { key: 'excerpt', type: 'textarea', label: 'Excerpt', wide: true },
                    { key: 'status', type: 'status', label: 'Publication Status' },
                    { key: 'published_at', type: 'datetime', label: 'Published At' },
                    { key: 'scheduled_at', type: 'datetime', label: 'Scheduled For' },
                ],
            },
            {
                id: 'content',
                title: 'Article Body',
                fields: [{ key: 'content', type: 'richtext', label: 'Content', wide: true }],
            },
            {
                id: 'media',
                title: 'Cover Image',
                fields: [{ key: 'thumbnail_path', type: 'media', label: 'Thumbnail', mediaKey: 'thumbnail_media', wide: true }],
            },
            {
                id: 'taxonomy',
                title: 'Tags',
                fields: [{ key: 'tags', type: 'list', label: 'Tags', wide: true }],
            },
            {
                id: 'seo',
                title: 'SEO',
                fields: [{ key: 'seo', type: 'seo' }],
            },
        ],
    },
    pages: {
        sections: [
            {
                id: 'settings',
                title: 'Page Settings',
                description: 'Basic page identity. Design content in AR Builder.',
                fields: [
                    { key: 'name', type: 'text', label: 'Page Name', required: true },
                    { key: 'slug', type: 'slug', source: 'name', label: 'URL Slug' },
                    { key: 'is_published', type: 'toggle', label: 'Published', hint: 'Unpublished pages return 404 on the live site.' },
                ],
            },
            {
                id: 'banner',
                title: 'Page Banner',
                fields: [{ key: 'banner_path', type: 'media', label: 'Banner Image', mediaKey: 'banner_media', wide: true }],
            },
            {
                id: 'legacy',
                title: 'Intro Text',
                description: 'Optional plain-text intro above AR Builder sections.',
                fields: [{ key: 'content', type: 'richtext', label: 'Intro Copy', wide: true, compact: true }],
            },
            {
                id: 'seo',
                title: 'SEO',
                fields: [{ key: 'seo', type: 'seo' }],
            },
        ],
    },
    contacts: {
        sections: [
            {
                id: 'inquiry',
                title: 'Inquiry Details',
                description: 'Read-only submission from a website form.',
                fields: [
                    { key: 'name', type: 'readonly', label: 'Name' },
                    { key: 'email', type: 'readonly', label: 'Email' },
                    { key: 'phone', type: 'readonly', label: 'Phone' },
                    { key: 'company', type: 'readonly', label: 'Company' },
                    { key: 'service', type: 'readonly', label: 'Service Interest' },
                    { key: 'budget', type: 'readonly', label: 'Budget' },
                    { key: 'message', type: 'readonly', label: 'Message', wide: true },
                    { key: 'read_at', type: 'datetime', label: 'Mark as read at' },
                ],
            },
        ],
    },
};
