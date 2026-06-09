import { useState } from 'react';
import { Link } from '../../app';
import {
    RiCheckLine,
    RiDraftLine,
    RiExternalLinkLine,
    RiGlobalLine,
    RiImageLine,
    RiSaveLine,
    RiSettings3Line,
    RiFileTextLine,
} from 'react-icons/ri';

const TAB_ICONS = {
    content: RiFileTextLine,
    media: RiImageLine,
    seo: RiGlobalLine,
    settings: RiSettings3Line,
};

export default function ResourceEditorShell({
    title,
    subtitle,
    tabs,
    previewUrl,
    onSubmit,
    onSaveDraft,
    onPublish,
    processing,
    cancelHref,
    sidebarExtra,
    children,
    statusLabel,
    saveLabel = 'Save',
    headerActions,
}) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id);

    const tab = tabs.find((entry) => entry.id === activeTab) || tabs[0];

    return (
        <form onSubmit={onSubmit} className="resource-editor">
            <header className="resource-editor-header">
                <div className="resource-editor-intro">
                    <p className="resource-editor-eyebrow">{title}</p>
                    <h2>{subtitle}</h2>
                    {statusLabel && <span className="resource-editor-status">{statusLabel}</span>}
                </div>
                <div className="resource-editor-actions">
                    {headerActions}
                    {previewUrl && (
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="resource-editor-btn is-ghost">
                            <RiExternalLinkLine /> Preview
                        </a>
                    )}
                    {onSaveDraft && (
                        <button type="button" className="resource-editor-btn is-ghost" disabled={processing} onClick={onSaveDraft}>
                            <RiDraftLine /> Save Draft
                        </button>
                    )}
                    <button type="submit" className={`resource-editor-btn ${onPublish ? 'is-secondary' : 'is-primary'}`} disabled={processing}>
                        <RiSaveLine /> {processing ? 'Saving…' : saveLabel}
                    </button>
                    {onPublish && (
                        <button type="button" className="resource-editor-btn is-primary" disabled={processing} onClick={onPublish}>
                            <RiCheckLine /> Publish
                        </button>
                    )}
                </div>
            </header>

            <div className="resource-editor-body">
                <aside className="resource-editor-side">
                    <nav className="resource-editor-tabs">
                        {tabs.map((entry) => {
                            const Icon = TAB_ICONS[entry.id] || RiFileTextLine;
                            return (
                                <button
                                    key={entry.id}
                                    type="button"
                                    className={`resource-editor-tab ${activeTab === entry.id ? 'is-active' : ''}`}
                                    onClick={() => setActiveTab(entry.id)}
                                >
                                    <Icon />
                                    <span>
                                        <strong>{entry.title}</strong>
                                        <small>{entry.hint}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                    {sidebarExtra}
                </aside>

                <div className="resource-editor-main">
                    {tab?.sections.map((section) => (
                        <section key={section.id} className="resource-editor-card">
                            <header className="resource-editor-card-head">
                                <div>
                                    <h3>{section.title}</h3>
                                    {section.description && <p>{section.description}</p>}
                                </div>
                            </header>
                            <div className="resource-editor-card-body">
                                {typeof children === 'function' ? children(section) : children}
                            </div>
                        </section>
                    ))}

                    <div className="resource-editor-footer">
                        {cancelHref && <Link href={cancelHref} className="resource-editor-cancel">Back to list</Link>}
                        <span className="resource-editor-footer-hint"><RiCheckLine /> Unsaved changes are lost if you leave without saving.</span>
                    </div>
                </div>
            </div>
        </form>
    );
}
