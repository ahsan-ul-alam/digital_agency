import AdminLayout from '../../Layouts/AdminLayout';
import { Input } from '../../Components/Form';
import { Link, useForm } from '../../app';
import { useRef } from 'react';

function slugify(value) {
    return String(value ?? '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function PageCreate() {
    const form = useForm({ name: '', slug: '' });
    const slugTouched = useRef(false);

    function onNameChange(value) {
        form.setData('name', value);
        if (!slugTouched.current) {
            form.setData('slug', slugify(value));
        }
    }

    function submit(event) {
        event.preventDefault();
        form.post('/admin/pages');
    }

    return (
        <AdminLayout title="Create Page" subtitle="Start with a name, then design the page in AR Builder.">
            <form onSubmit={submit} className="glass grid max-w-xl gap-5 rounded-3xl p-6">
                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-muted">Page Name</span>
                    <Input value={form.data.name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. About Us" autoFocus />
                    {form.errors.name && <span className="text-sm text-rose-300">{form.errors.name}</span>}
                </label>
                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-muted">Slug</span>
                    <Input
                        value={form.data.slug}
                        onChange={(e) => { slugTouched.current = true; form.setData('slug', e.target.value); }}
                        placeholder="Auto-generated from name"
                    />
                    {form.errors.slug && <span className="text-sm text-rose-300">{form.errors.slug}</span>}
                </label>
                <p className="text-sm text-muted">After creating, you will open AR Builder to drag elements, style blocks, and publish.</p>
                <div className="flex gap-3">
                    <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">
                        Create & Open AR Builder
                    </button>
                    <Link href="/admin/pages" className="btn-outline rounded-full px-6 py-3">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
