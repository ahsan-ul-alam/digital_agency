import { useState } from 'react';
import { Link } from '../../app';
import { RiCheckLine, RiSaveLine } from 'react-icons/ri';

export default function FormShell({
    title,
    subtitle,
    sections,
    activeSection,
    onSectionChange,
    onSubmit,
    processing,
    cancelHref,
    sidebarExtra,
    children,
}) {
    const [current, setCurrent] = useState(activeSection || sections[0]?.id);

    function selectSection(id) {
        setCurrent(id);
        onSectionChange?.(id);
    }

    const active = current || sections[0]?.id;

    return (
        <form onSubmit={onSubmit} className="cms-form-shell">
            <aside className="cms-form-nav">
                <div className="cms-form-nav-head">
                    <p className="cms-form-nav-eyebrow">Editor</p>
                    <h2>{title}</h2>
                    {subtitle && <p>{subtitle}</p>}
                </div>
                <nav className="cms-form-nav-list">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            className={`cms-form-nav-item ${active === section.id ? 'is-active' : ''}`}
                            onClick={() => selectSection(section.id)}
                        >
                            <span>{section.title}</span>
                            {section.hint && <small>{section.hint}</small>}
                        </button>
                    ))}
                </nav>
                {sidebarExtra}
            </aside>

            <div className="cms-form-main">
                {sections.map((section) => (
                    <section
                        key={section.id}
                        className={`cms-form-section ${active === section.id ? 'is-active' : ''}`}
                    >
                        <header className="cms-form-section-head">
                            <div>
                                <h3>{section.title}</h3>
                                {section.description && <p>{section.description}</p>}
                            </div>
                        </header>
                        <div className="cms-form-section-body">
                            {typeof children === 'function' ? children(section) : children}
                        </div>
                    </section>
                ))}

                <div className="cms-form-actions">
                    <button type="submit" disabled={processing} className="cms-form-save">
                        <RiSaveLine /> {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                    {cancelHref && (
                        <Link href={cancelHref} className="cms-form-cancel">Cancel</Link>
                    )}
                    <span className="cms-form-save-hint"><RiCheckLine /> Changes apply to the live site when published</span>
                </div>
            </div>
        </form>
    );
}
