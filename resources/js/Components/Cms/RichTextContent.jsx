import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span', 'iframe', 'hr',
    'label', 'input',
];

const ALLOWED_ATTR = [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'data-type', 'data-callout',
    'width', 'height', 'style', 'colspan', 'rowspan', 'align', 'type', 'checked', 'disabled',
    'frameborder', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy',
];

function isHtml(value) {
    return typeof value === 'string' && /<[a-z][\s\S]*>/i.test(value);
}

function plainToHtml(value) {
    if (!value) return '';
    return value
        .split('\n')
        .filter(Boolean)
        .map((line) => `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
        .join('');
}

export default function RichTextContent({ html, className = '' }) {
    if (!html) return null;

    const source = isHtml(html) ? html : plainToHtml(html);
    const clean = DOMPurify.sanitize(source, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'referrerpolicy'],
    });

    return (
        <div
            className={`rich-text-content ${className}`.trim()}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
