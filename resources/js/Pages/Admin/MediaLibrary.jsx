import { useRef, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Input } from '../../Components/Form';
import { Link, router, useForm, usePage } from '../../app';
import {
    RiCloudLine,
    RiDeleteBinLine,
    RiFileCopyLine,
    RiImageLine,
    RiUploadCloud2Line,
    RiVideoLine,
} from 'react-icons/ri';

function formatSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaPreview({ item }) {
    const url = item.secure_url || item.file_path;
    const isVideo = item.mime_type?.startsWith('video/');

    if (!url) {
        return (
            <div className="grid h-40 place-items-center rounded-2xl bg-white/5 text-muted">
                <RiImageLine className="text-3xl" />
            </div>
        );
    }

    if (isVideo) {
        return (
            <video src={url} className="h-40 w-full rounded-2xl bg-black object-cover" controls preload="metadata" />
        );
    }

    return <img src={url} alt={item.alt_text || item.name} className="h-40 w-full rounded-2xl object-cover" loading="lazy" />;
}

function MediaCard({ item }) {
    const [copied, setCopied] = useState(false);
    const url = item.secure_url || item.file_path;

    function copyUrl() {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function remove() {
        if (confirm('Delete this media item?')) {
            router.delete(`/admin/media/${item.id}`);
        }
    }

    return (
        <div className="glass overflow-hidden rounded-3xl">
            <MediaPreview item={item} />
            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-muted">
                            {item.disk === 'cloudinary' ? 'Cloudinary' : 'Local'} · {formatSize(item.size)}
                        </p>
                    </div>
                    {item.mime_type?.startsWith('video/') ? (
                        <RiVideoLine className="shrink-0 text-primary" />
                    ) : (
                        <RiImageLine className="shrink-0 text-primary" />
                    )}
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={copyUrl}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-muted hover:bg-white/5"
                    >
                        <RiFileCopyLine />
                        {copied ? 'Copied' : 'Copy URL'}
                    </button>
                    <button
                        type="button"
                        onClick={remove}
                        className="rounded-xl border border-rose-400/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-400/10"
                    >
                        <RiDeleteBinLine />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MediaLibrary({ items, cloudinaryConnected }) {
    const { flash } = usePage().props;
    const fileRef = useRef(null);
    const form = useForm({ upload_file: null, name: '', alt_text: '' });

    function submit(e) {
        e.preventDefault();
        form.post('/admin/media', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    }

    function onFileChange(e) {
        const file = e.target.files[0];
        form.setData('upload_file', file);
        if (file && !form.data.name) {
            form.setData('name', file.name.replace(/\.[^.]+$/, ''));
        }
    }

    return (
        <AdminLayout
            title="Media Library"
            subtitle="Upload images and videos to Cloudinary. Copy URLs and reuse them across services, portfolio, team and pages."
        >
            {!cloudinaryConnected && (
                <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                    Cloudinary is not connected yet. Uploads will be stored locally until you configure it in{' '}
                    <Link href="/admin/cloudinary/settings" className="font-semibold underline">Cloudinary Settings</Link>.
                </div>
            )}

            {flash?.success && (
                <p className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                    {flash.success}
                </p>
            )}

            <form onSubmit={submit} className="glass mb-8 rounded-3xl p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
                    <label className="grid flex-1 gap-2">
                        <span className="text-sm font-semibold text-muted">Upload File *</span>
                        <div
                            className="cursor-pointer rounded-2xl border surface-dashed px-4 py-8 text-center transition card-hover"
                            onClick={() => fileRef.current?.click()}
                        >
                            <RiUploadCloud2Line className="mx-auto text-3xl text-primary" />
                            <p className="mt-3 text-sm text-muted">
                                {form.data.upload_file ? form.data.upload_file.name : 'Click to choose image or video'}
                            </p>
                            <p className="mt-1 text-xs text-muted">JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV — max 50MB</p>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
                        {form.errors.upload_file && <span className="text-sm text-rose-300">{form.errors.upload_file}</span>}
                    </label>
                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                        <label className="grid gap-2">
                            <span className="text-sm font-semibold text-muted">Display Name</span>
                            <Input
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Auto-filled from filename"
                            />
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm font-semibold text-muted">Alt Text</span>
                            <Input
                                value={form.data.alt_text}
                                onChange={(e) => form.setData('alt_text', e.target.value)}
                                placeholder="Optional accessibility text"
                            />
                        </label>
                    </div>
                    <button
                        disabled={form.processing || !form.data.upload_file}
                        className="inline-flex items-center justify-center gap-2 btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-50"
                    >
                        <RiCloudLine />
                        {form.processing ? 'Uploading...' : 'Upload to Cloudinary'}
                    </button>
                </div>
            </form>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted">{items.total} assets</p>
                {items.last_page > 1 && (
                    <p className="text-sm text-muted">Page {items.current_page} of {items.last_page}</p>
                )}
            </div>

            {items.data.length === 0 ? (
                <div className="glass rounded-3xl p-12 text-center">
                    <RiImageLine className="mx-auto text-4xl text-slate-600" />
                    <p className="mt-4 text-lg font-semibold text-muted">No media yet</p>
                    <p className="mt-2 text-sm text-muted">Upload your first image or video using the form above.</p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {items.data.map((item) => <MediaCard key={item.id} item={item} />)}
                </div>
            )}

            {(items.prev_page_url || items.next_page_url) && (
                <div className="mt-6 flex justify-end gap-2">
                    {items.prev_page_url && (
                        <Link href={items.prev_page_url} className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted hover:bg-white/5">
                            Previous
                        </Link>
                    )}
                    {items.next_page_url && (
                        <Link href={items.next_page_url} className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted hover:bg-white/5">
                            Next
                        </Link>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
