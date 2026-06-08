export const STYLE_OPTIONS = {
    padding: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
    ],
    background: [
        { value: 'none', label: 'Transparent' },
        { value: 'subtle', label: 'Subtle Panel' },
        { value: 'glass', label: 'Glass' },
        { value: 'muted', label: 'Muted' },
        { value: 'primary', label: 'Primary Tint' },
        { value: 'gradient', label: 'Gradient CTA' },
    ],
    textAlign: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ],
    borderRadius: [
        { value: 'none', label: 'Square' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'XL' },
        { value: '2xl', label: '2XL' },
        { value: '3xl', label: '3XL' },
    ],
    maxWidth: [
        { value: 'full', label: 'Full Width' },
        { value: 'wide', label: 'Wide' },
        { value: 'narrow', label: 'Narrow' },
    ],
    columns: [
        { value: '1', label: '1 Column' },
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
    ],
    gap: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
    ],
    headingLevel: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'h4', label: 'H4' },
        { value: 'h5', label: 'H5' },
        { value: 'h6', label: 'H6' },
    ],
    buttonVariant: [
        { value: 'primary', label: 'Primary' },
        { value: 'outline', label: 'Outline' },
    ],
    carouselHeight: [
        { value: 'sm', label: 'Small (240px)' },
        { value: 'md', label: 'Medium (320px)' },
        { value: 'lg', label: 'Large (420px)' },
        { value: 'xl', label: 'Extra Large (520px)' },
        { value: 'full', label: 'Full viewport (70vh)' },
        { value: 'custom', label: 'Custom height' },
    ],
    imageFit: [
        { value: 'cover', label: 'Cover (fill & crop)' },
        { value: 'contain', label: 'Contain (fit inside)' },
    ],
    carouselAnimation: [
        { value: 'fade', label: 'Fade' },
        { value: 'slide', label: 'Slide horizontal' },
        { value: 'slide-up', label: 'Slide up' },
        { value: 'zoom', label: 'Zoom' },
        { value: 'ken-burns', label: 'Ken Burns (slow zoom)' },
    ],
    animationSpeed: [
        { value: 'slow', label: 'Slow (800ms)' },
        { value: 'normal', label: 'Normal (500ms)' },
        { value: 'fast', label: 'Fast (300ms)' },
    ],
    carouselInterval: [
        { value: '3', label: '3 seconds' },
        { value: '5', label: '5 seconds' },
        { value: '7', label: '7 seconds' },
        { value: '10', label: '10 seconds' },
    ],
    yesNo: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
    ],
};

const carouselStyleFields = [
    { key: 'height', label: 'Carousel Height', type: 'select', options: STYLE_OPTIONS.carouselHeight },
    { key: 'custom_height', label: 'Custom Height (px)', type: 'text' },
    { key: 'image_fit', label: 'Image Fit', type: 'select', options: STYLE_OPTIONS.imageFit },
    { key: 'animation', label: 'Animation', type: 'select', options: STYLE_OPTIONS.carouselAnimation },
    { key: 'animation_speed', label: 'Transition Speed', type: 'select', options: STYLE_OPTIONS.animationSpeed },
    { key: 'borderRadius', label: 'Corners', type: 'select', options: STYLE_OPTIONS.borderRadius },
    { key: 'padding', label: 'Padding', type: 'select', options: STYLE_OPTIONS.padding },
    { key: 'background', label: 'Background', type: 'select', options: STYLE_OPTIONS.background },
    { key: 'maxWidth', label: 'Content Width', type: 'select', options: STYLE_OPTIONS.maxWidth },
];

const commonStyleFields = [
    { key: 'padding', label: 'Padding', type: 'select', options: STYLE_OPTIONS.padding },
    { key: 'background', label: 'Background', type: 'select', options: STYLE_OPTIONS.background },
    { key: 'textAlign', label: 'Text Align', type: 'select', options: STYLE_OPTIONS.textAlign },
    { key: 'borderRadius', label: 'Corners', type: 'select', options: STYLE_OPTIONS.borderRadius },
    { key: 'maxWidth', label: 'Content Width', type: 'select', options: STYLE_OPTIONS.maxWidth },
];

const gridStyleFields = [
    { key: 'columns', label: 'Columns', type: 'select', options: STYLE_OPTIONS.columns },
    { key: 'gap', label: 'Gap', type: 'select', options: STYLE_OPTIONS.gap },
];

const mediaItemFields = [
    { key: 'url', label: 'Image', type: 'media' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text' },
];

export const BLOCK_LIBRARY = [
    { type: 'heading', category: 'Basic', label: 'Heading', description: 'H1–H6 title', defaults: { text: 'Section heading', level: 'h2' }, contentFields: [{ key: 'text', label: 'Text', type: 'text' }, { key: 'level', label: 'Level', type: 'select', options: STYLE_OPTIONS.headingLevel }], styleFields: commonStyleFields },
    { type: 'text', category: 'Basic', label: 'Plain Text', description: 'Paragraph copy', defaults: { body: 'Write your paragraph here.' }, contentFields: [{ key: 'body', label: 'Text', type: 'richtext' }], styleFields: commonStyleFields },
    { type: 'button', category: 'Basic', label: 'Button', description: 'Standalone CTA button', defaults: { label: 'Learn more', url: '/contact', variant: 'primary' }, contentFields: [{ key: 'label', label: 'Label', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }, { key: 'variant', label: 'Style', type: 'select', options: STYLE_OPTIONS.buttonVariant }], styleFields: commonStyleFields },
    { type: 'image', category: 'Basic', label: 'Image', description: 'Single image from gallery', defaults: { url: '', alt: '', caption: '', media: null }, contentFields: [{ key: 'url', label: 'Image', type: 'media' }, { key: 'alt', label: 'Alt Text', type: 'text' }, { key: 'caption', label: 'Caption', type: 'text' }], styleFields: commonStyleFields },
    { type: 'video', category: 'Basic', label: 'Video', description: 'Uploaded or embed URL', defaults: { url: '', poster: '', autoplay: false }, contentFields: [{ key: 'url', label: 'Video URL / Upload', type: 'media' }, { key: 'poster', label: 'Poster Image', type: 'media' }, { key: 'autoplay', label: 'Autoplay', type: 'select', options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }] }], styleFields: commonStyleFields },
    { type: 'spacer', category: 'Basic', label: 'Spacer', description: 'Vertical spacing', defaults: { styles: { height: 'lg' } }, contentFields: [], styleFields: [{ key: 'height', label: 'Height', type: 'select', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }, { value: 'xl', label: 'Extra Large' }] }] },
    { type: 'divider', category: 'Basic', label: 'Divider', description: 'Horizontal rule', defaults: {}, contentFields: [], styleFields: [{ key: 'padding', label: 'Padding', type: 'select', options: STYLE_OPTIONS.padding }] },

    { type: 'hero', category: 'Layout', label: 'Hero', description: 'Large headline section', defaults: { eyebrow: 'Section', title: 'Your headline here', body: 'Supporting copy for this section.' }, contentFields: [{ key: 'eyebrow', label: 'Eyebrow', type: 'text' }, { key: 'title', label: 'Title', type: 'text' }, { key: 'body', label: 'Body', type: 'richtext' }], styleFields: commonStyleFields },
    { type: 'content', category: 'Layout', label: 'Content Box', description: 'Title and body card', defaults: { title: 'Content block', body: 'Write your page content here.' }, contentFields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'body', label: 'Body', type: 'richtext' }], styleFields: commonStyleFields },
    { type: 'tabs', category: 'Layout', label: 'Tabs', description: 'Tabbed content panels', defaults: { title: '', items: [{ title: 'Tab 1', body: 'Tab content here.' }, { title: 'Tab 2', body: 'More content.' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Tabs', type: 'repeater', itemFields: [{ key: 'title', label: 'Tab Title', type: 'text' }, { key: 'body', label: 'Tab Content', type: 'richtext' }] }], styleFields: commonStyleFields },
    {
        type: 'carousel',
        category: 'Layout',
        label: 'Carousel',
        description: 'Slideshow with resize, animations and controls',
        defaults: {
            title: '',
            autoplay: 'true',
            interval: '5',
            show_arrows: 'true',
            show_dots: 'true',
            pause_on_hover: 'true',
            items: [{ url: '', alt: 'Slide 1', caption: '' }],
            styles: {
                height: 'lg',
                custom_height: '420',
                image_fit: 'cover',
                animation: 'fade',
                animation_speed: 'normal',
                borderRadius: '2xl',
            },
        },
        contentFields: [
            { key: 'title', label: 'Section Title', type: 'text' },
            { key: 'autoplay', label: 'Autoplay', type: 'select', options: STYLE_OPTIONS.yesNo },
            { key: 'interval', label: 'Autoplay Interval', type: 'select', options: STYLE_OPTIONS.carouselInterval },
            { key: 'show_arrows', label: 'Show Arrows', type: 'select', options: STYLE_OPTIONS.yesNo },
            { key: 'show_dots', label: 'Show Dot Navigation', type: 'select', options: STYLE_OPTIONS.yesNo },
            { key: 'pause_on_hover', label: 'Pause on Hover', type: 'select', options: STYLE_OPTIONS.yesNo },
            { key: 'items', label: 'Slides', type: 'repeater', itemFields: mediaItemFields },
        ],
        styleFields: carouselStyleFields,
    },
    { type: 'gallery', category: 'Layout', label: 'Gallery', description: 'Image grid from media library', defaults: { title: '', items: [{ url: '', alt: 'Gallery image' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Images', type: 'repeater', itemFields: mediaItemFields }], styleFields: [...commonStyleFields, ...gridStyleFields] },

    { type: 'cta', category: 'Marketing', label: 'Call to Action', description: 'Prominent CTA strip', defaults: { title: 'Ready to get started?', body: 'Tell us about your project.', button: 'Contact us', url: '/contact' }, contentFields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'body', label: 'Body', type: 'richtext' }, { key: 'button', label: 'Button Label', type: 'text' }, { key: 'url', label: 'Button URL', type: 'text' }], styleFields: commonStyleFields },
    { type: 'features', category: 'Marketing', label: 'Features', description: 'Grid of feature cards', defaults: { title: '', items: [{ title: 'Feature one', body: 'Short description.' }, { title: 'Feature two', body: 'Short description.' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Features', type: 'repeater', itemFields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'body', label: 'Body', type: 'richtext' }] }], styleFields: [...commonStyleFields, ...gridStyleFields] },
    { type: 'testimonials', category: 'Marketing', label: 'Testimonials', description: 'Client quotes grid', defaults: { title: '', items: [{ name: 'Client name', review: 'Great experience.' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Testimonials', type: 'repeater', itemFields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'review', label: 'Review', type: 'richtext' }] }], styleFields: [...commonStyleFields, ...gridStyleFields] },
    { type: 'counter', category: 'Marketing', label: 'Counter', description: 'Animated number counters', defaults: { title: '', items: [{ value: '120', suffix: '+', label: 'Projects delivered' }, { value: '98', suffix: '%', label: 'Client satisfaction' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Counters', type: 'repeater', itemFields: [{ key: 'value', label: 'Value', type: 'text' }, { key: 'suffix', label: 'Suffix', type: 'text' }, { key: 'label', label: 'Label', type: 'text' }] }], styleFields: [...commonStyleFields, ...gridStyleFields] },
    { type: 'stats', category: 'Marketing', label: 'Statistics', description: 'Static stat cards', defaults: { title: '', items: [{ value: '50', suffix: '+', label: 'Projects' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Stats', type: 'repeater', itemFields: [{ key: 'value', label: 'Value', type: 'text' }, { key: 'suffix', label: 'Suffix', type: 'text' }, { key: 'label', label: 'Label', type: 'text' }] }], styleFields: [...commonStyleFields, ...gridStyleFields] },

    { type: 'form', category: 'Interactive', label: 'Form', description: 'Embed form by shortcode', defaults: { title: 'Get in touch', shortcode: '', description: '' }, contentFields: [{ key: 'title', label: 'Form Title', type: 'text' }, { key: 'description', label: 'Description', type: 'richtext' }, { key: 'shortcode', label: 'Form Shortcode', type: 'form_select' }], styleFields: commonStyleFields },
    { type: 'map', category: 'Interactive', label: 'Map', description: 'Google Maps embed', defaults: { title: 'Our location', embed_url: 'https://maps.google.com/maps?q=Dhaka&output=embed', height: '400' }, contentFields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'embed_url', label: 'Embed URL', type: 'text' }, { key: 'height', label: 'Height (px)', type: 'text' }], styleFields: commonStyleFields },
    { type: 'faq', category: 'Interactive', label: 'FAQ', description: 'Accordion questions', defaults: { title: 'Frequently asked questions', items: [{ question: 'Question here?', answer: 'Answer here.' }] }, contentFields: [{ key: 'title', label: 'Section Title', type: 'text' }, { key: 'items', label: 'Questions', type: 'repeater', itemFields: [{ key: 'question', label: 'Question', type: 'text' }, { key: 'answer', label: 'Answer', type: 'richtext' }] }], styleFields: commonStyleFields },
];

export const BLOCK_CATEGORIES = [...new Set(BLOCK_LIBRARY.map((block) => block.category))];

export function getBlockDefinition(type) {
    return BLOCK_LIBRARY.find((block) => block.type === type) || BLOCK_LIBRARY.find((block) => block.type === 'text');
}

export function createBlock(type) {
    const definition = getBlockDefinition(type);
    const defaults = structuredClone(definition.defaults || {});
    const styles = defaults.styles || {};
    delete defaults.styles;

    return {
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: definition.type,
        styles,
        ...defaults,
    };
}

export function normalizeSections(value) {
    const sections = Array.isArray(value)
        ? value
        : (() => {
            if (!value) return [];
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        })();

    return sections.map((section, index) => ({
        ...section,
        id: section.id || `block-${index}-${section.type || 'content'}`,
        styles: section.styles || {},
        type: section.type || 'content',
    }));
}
