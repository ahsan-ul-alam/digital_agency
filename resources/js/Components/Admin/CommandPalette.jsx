import { useEffect, useMemo, useState } from 'react';
import { Link, router } from '../../app';
import { NavIcon } from '../../Admin/icons';
import { RiAddLine, RiCommandLine, RiSearchLine, RiStarLine } from 'react-icons/ri';

const quickCreates = [
    { label: 'Create Page', href: '/admin/pages/create', icon: 'pages' },
    { label: 'Add Service', href: '/admin/services/create', icon: 'services' },
    { label: 'Add Package', href: '/admin/packages/create', icon: 'packages' },
    { label: 'Write Blog Post', href: '/admin/blog/create', icon: 'blog' },
    { label: 'Upload Media', href: '/admin/media', icon: 'media' },
    { label: 'Add Portfolio', href: '/admin/portfolio/create', icon: 'portfolio' },
];

export default function CommandPalette({ open, onClose, items = [] }) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!open) setQuery('');
    }, [open]);

    useEffect(() => {
        function onKeyDown(event) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                onClose(open ? false : true);
            }
            if (event.key === 'Escape') onClose(false);
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items.slice(0, 12);
        return items.filter((item) =>
            [item.title, item.description, item.group, item.href].join(' ').toLowerCase().includes(q)
        ).slice(0, 14);
    }, [items, query]);

    const createResults = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return quickCreates.slice(0, 4);
        return quickCreates.filter((item) => item.label.toLowerCase().includes(q));
    }, [query]);

    if (!open) return null;

    return (
        <div className="admin-command-overlay" onClick={() => onClose(false)}>
            <div className="admin-command-panel" onClick={(e) => e.stopPropagation()}>
                <div className="admin-command-search">
                    <RiSearchLine />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search modules, pages, settings..."
                    />
                    <span className="admin-command-kbd"><RiCommandLine />K</span>
                </div>

                {createResults.length > 0 && (
                    <div className="admin-command-section">
                        <p className="admin-command-label">Quick Create</p>
                        <div className="admin-command-list">
                            {createResults.map((item) => (
                                <button
                                    key={item.href}
                                    type="button"
                                    className="admin-command-item"
                                    onClick={() => { router.visit(item.href); onClose(false); }}
                                >
                                    <span className="admin-command-icon"><NavIcon name={item.icon} /></span>
                                    <span>{item.label}</span>
                                    <RiAddLine className="admin-command-meta" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="admin-command-section">
                    <p className="admin-command-label">Navigate</p>
                    <div className="admin-command-list">
                        {results.length === 0 ? (
                            <p className="admin-command-empty">No matching modules found.</p>
                        ) : results.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="admin-command-item"
                                onClick={() => onClose(false)}
                            >
                                <span className="admin-command-icon"><NavIcon name={item.key} /></span>
                                <span className="admin-command-copy">
                                    <strong>{item.title}</strong>
                                    <small>{item.group}</small>
                                </span>
                                <RiStarLine className="admin-command-meta" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
