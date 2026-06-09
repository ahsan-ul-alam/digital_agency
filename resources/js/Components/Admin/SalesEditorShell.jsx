import { useState } from 'react';
import { Link } from '../../app';
import {
    RiFileList3Line,
    RiSaveLine,
    RiSettings3Line,
    RiUser3Line,
} from 'react-icons/ri';

const TAB_ICONS = {
    client: RiUser3Line,
    proposal: RiFileList3Line,
    items: RiFileList3Line,
    settings: RiSettings3Line,
};

export default function SalesEditorShell({
    title,
    subtitle,
    tabs,
    onSubmit,
    processing,
    cancelHref,
    statusLabel,
    saveLabel = 'Save',
    headerActions,
    children,
}) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id);
    const tab = tabs.find((entry) => entry.id === activeTab) || tabs[0];

    return (
        <form onSubmit={onSubmit} className="resource-editor sales-editor">
            <header className="resource-editor-header">
                <div className="resource-editor-intro">
                    <p className="resource-editor-eyebrow">{title}</p>
                    <h2>{subtitle}</h2>
                    {statusLabel && <span className="resource-editor-status">{statusLabel}</span>}
                </div>
                <div className="resource-editor-actions">
                    {headerActions}
                    <button type="submit" className="resource-editor-btn is-primary" disabled={processing}>
                        <RiSaveLine /> {processing ? 'Saving…' : saveLabel}
                    </button>
                </div>
            </header>

            <div className="resource-editor-body">
                <aside className="resource-editor-side">
                    <nav className="resource-editor-tabs">
                        {tabs.map((entry) => {
                            const Icon = entry.icon || TAB_ICONS[entry.id] || RiFileList3Line;
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
                </aside>

                <div className="resource-editor-main">
                    <section className="resource-editor-card">
                        <header className="resource-editor-card-head">
                            <div>
                                <h3>{tab?.panelTitle || tab?.title}</h3>
                                {tab?.hint && <p>{tab?.panelHint || tab?.hint}</p>}
                            </div>
                        </header>
                        <div className="resource-editor-card-body">
                            {typeof children === 'function' ? children(tab?.id) : children}
                        </div>
                    </section>

                    {cancelHref && (
                        <div className="resource-editor-footer">
                            <Link href={cancelHref} className="resource-editor-cancel">Back to list</Link>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
