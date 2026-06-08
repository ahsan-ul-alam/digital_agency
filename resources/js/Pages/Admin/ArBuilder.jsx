import { Head, Link, router, useForm, usePage } from '../../app';
import PageBuilder from '../../Components/PageBuilder/PageBuilder';
import { ThemeStyles } from '../../Components/Public';
import { normalizeSections } from '../../Components/PageBuilder/blocks';
import { Input } from '../../Components/Form';
import { RiArrowLeftLine, RiExternalLinkLine, RiSave3Line, RiUploadCloud2Line } from 'react-icons/ri';

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

    return (
        <div className="ar-builder-shell min-h-screen">
            <ThemeStyles theme={theme} />
            <Head title={`AR Builder · ${page.name}`} />

            <header className="ar-builder-topbar">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
                        <RiArrowLeftLine /> Pages
                    </Link>
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-primary">AR Builder</p>
                        <p className="font-bold">{page.name}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <label className="hidden items-center gap-2 text-sm text-muted sm:flex">
                        <span>Slug</span>
                        <Input className="w-48" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                    </label>
                    <label className="hidden items-center gap-2 text-sm text-muted md:flex">
                        <span>Name</span>
                        <Input className="w-48" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </label>
                    {page.is_published && (
                        <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                            <RiExternalLinkLine /> View Live
                        </a>
                    )}
                    <button type="button" disabled={form.processing} onClick={() => save(false)} className="btn-outline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                        <RiSave3Line /> Save Draft
                    </button>
                    <button type="button" disabled={form.processing} onClick={() => save(true)} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold">
                        <RiUploadCloud2Line /> {page.is_published ? 'Update & Publish' : 'Publish'}
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
