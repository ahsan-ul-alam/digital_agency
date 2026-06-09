import { Head, Link, router, useForm, usePage } from '../../app';
import PageBuilder from '../../Components/PageBuilder/PageBuilder';
import { ThemeStyles } from '../../Components/Public';
import { normalizeSections } from '../../Components/PageBuilder/blocks';
import { Input } from '../../Components/Form';
import {
    RiArrowLeftLine,
    RiCheckLine,
    RiDraftLine,
    RiExternalLinkLine,
    RiLayoutMasonryLine,
    RiSave3Line,
    RiSettings3Line,
} from 'react-icons/ri';

export default function ArBuilder({ page, forms }) {
    const { theme = {} } = usePage().props;
    const form = useForm({
        name: page.name,
        slug: page.slug,
        sections: normalizeSections(page.sections),
        seo: page.seo || {},
        is_published: Boolean(page.is_published),
    });

    function save(publish = false) {
        router.put(`/admin/pages/${page.id}/builder`, {
            ...form.data,
            is_published: publish,
        }, { preserveScroll: true });
    }

    const statusLabel = form.data.is_published ? 'Published' : 'Draft';
    const elementCount = form.data.sections?.length || 0;

    return (
        <div className="ar-builder-shell min-h-screen">
            <ThemeStyles theme={theme} />
            <Head title={`AR Builder · ${page.name}`} />

            <header className="ar-builder-topbar">
                <div className="ar-builder-topbar-left">
                    <Link href="/admin/pages" className="ar-builder-back">
                        <RiArrowLeftLine /> Pages
                    </Link>
                    <div className="ar-builder-title">
                        <p className="ar-builder-eyebrow"><RiLayoutMasonryLine /> AR Builder</p>
                        <h1>{form.data.name || page.name}</h1>
                        <div className="ar-builder-meta">
                            <span className={`resource-editor-status ${form.data.is_published ? '' : 'is-draft'}`}>{statusLabel}</span>
                            <span className="ar-builder-meta-count">{elementCount} element{elementCount === 1 ? '' : 's'}</span>
                        </div>
                    </div>
                </div>

                <div className="ar-builder-fields">
                    <label className="ar-builder-field">
                        <span>Page name</span>
                        <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </label>
                    <label className="ar-builder-field">
                        <span>Slug</span>
                        <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                    </label>
                </div>

                <div className="ar-builder-actions">
                    <Link href={`/admin/pages/${page.id}/edit`} className="resource-editor-btn is-ghost">
                        <RiSettings3Line /> Page settings
                    </Link>
                    {page.is_published && (
                        <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="resource-editor-btn is-ghost">
                            <RiExternalLinkLine /> Preview
                        </a>
                    )}
                    <button type="button" disabled={form.processing} onClick={() => save(false)} className="resource-editor-btn is-ghost">
                        <RiDraftLine /> Save draft
                    </button>
                    <button type="button" disabled={form.processing} onClick={() => save(false)} className="resource-editor-btn is-secondary">
                        <RiSave3Line /> Save
                    </button>
                    <button type="button" disabled={form.processing} onClick={() => save(true)} className="resource-editor-btn is-primary">
                        <RiCheckLine /> {page.is_published ? 'Update & publish' : 'Publish'}
                    </button>
                </div>
            </header>

            <main className="ar-builder-main">
                <PageBuilder
                    value={form.data.sections}
                    forms={forms}
                    onChange={(sections) => form.setData('sections', sections)}
                />
            </main>
        </div>
    );
}
