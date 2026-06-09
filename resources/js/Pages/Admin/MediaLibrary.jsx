import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import EmptyState from '../../Components/Admin/EmptyState';
import { Input } from '../../Components/Form';
import { Link, router, useForm } from '../../app';
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCloseLine,
    RiCloudLine,
    RiDeleteBinLine,
    RiExternalLinkLine,
    RiFileCopyLine,
    RiFolderImageLine,
    RiImageLine,
    RiLayoutGridLine,
    RiListUnordered,
    RiSearchLine,
    RiUploadCloud2Line,
    RiVideoLine,
} from 'react-icons/ri';

function formatSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mediaUrl(item) {
    return item.secure_url || item.file_path || '';
}

function StatCard({ icon: Icon, label, value, active, onClick }) {
    return (
        <button
            type="button"
            className={`admin-media-stat${active ? ' is-active' : ''}`}
            onClick={onClick}
        >
            <span className="admin-media-stat-icon"><Icon /></span>
            <span className="admin-media-stat-copy">
                <strong>{value}</strong>
                <small>{label}</small>
            </span>
        </button>
    );
}

function MediaPreview({ item, large = false }) {
    const url = mediaUrl(item);
    const isVideo = item.mime_type?.startsWith('video/');

    if (!url) {
        return (
            <div className={`admin-media-preview-fallback${large ? ' is-large' : ''}`}>
                <RiImageLine />
            </div>
        );
    }

    if (isVideo) {
        return (
            <div className={`admin-media-preview-video${large ? ' is-large' : ''}`}>
                <video src={url} muted preload="metadata" controls={large} />
                {!large && <span className="admin-media-preview-play"><RiVideoLine /></span>}
            </div>
        );
    }

    return <img src={url} alt={item.alt_text || item.name} loading="lazy" />;
}

function MediaDetailPanel({ item, onClose, onDeleted }) {
    const url = mediaUrl(item);
    const detailForm = useForm({
        name: item.name || '',
        alt_text: item.alt_text || '',
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        detailForm.setData({
            name: item.name || '',
            alt_text: item.alt_text || '',
        });
    }, [item.id, item.name, item.alt_text]);

    function copyUrl() {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function saveDetails() {
        detailForm.put(`/admin/media/${item.id}`, {
            preserveScroll: true,
        });
    }

    function remove() {
        if (!window.confirm('Delete this media item?')) return;
        router.delete(`/admin/media/${item.id}`, {
            preserveScroll: true,
            onSuccess: onDeleted,
        });
    }

    return (
        <aside className="admin-media-detail">
            <header className="admin-media-detail-head">
                <div>
                    <p className="resource-editor-eyebrow">Attachment details</p>
                    <h3>{item.name}</h3>
                </div>
                <button type="button" className="admin-media-detail-close" onClick={onClose} aria-label="Close details">
                    <RiCloseLine />
                </button>
            </header>

            <div className="admin-media-detail-preview">
                <MediaPreview item={item} large />
            </div>

            <dl className="admin-media-detail-meta">
                <div><dt>Type</dt><dd>{item.mime_type || '—'}</dd></div>
                <div><dt>Size</dt><dd>{formatSize(item.size)}</dd></div>
                <div><dt>Storage</dt><dd>{item.disk === 'cloudinary' ? 'Cloudinary' : 'Local'}</dd></div>
                <div><dt>Uploaded</dt><dd>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</dd></div>
            </dl>

            <form className="admin-media-detail-form" onSubmit={(e) => { e.preventDefault(); saveDetails(); }}>
                <label className="admin-media-field">
                    <span>Display name</span>
                    <Input
                        value={detailForm.data.name}
                        onChange={(e) => detailForm.setData('name', e.target.value)}
                    />
                </label>
                <label className="admin-media-field">
                    <span>Alt text</span>
                    <Input
                        value={detailForm.data.alt_text}
                        onChange={(e) => detailForm.setData('alt_text', e.target.value)}
                        placeholder="Optional accessibility text"
                    />
                </label>
                <button type="submit" className="admin-media-upload-btn" disabled={detailForm.processing}>
                    {detailForm.processing ? 'Saving…' : 'Save details'}
                </button>
            </form>

            <div className="admin-media-detail-actions">
                <button type="button" className="admin-media-detail-btn" onClick={copyUrl} disabled={!url}>
                    <RiFileCopyLine /> {copied ? 'Copied' : 'Copy URL'}
                </button>
                {url && (
                    <a href={url} className="admin-media-detail-btn" target="_blank" rel="noreferrer">
                        <RiExternalLinkLine /> Open file
                    </a>
                )}
                <button type="button" className="admin-media-detail-btn is-danger" onClick={remove}>
                    <RiDeleteBinLine /> Delete
                </button>
            </div>
        </aside>
    );
}

function MediaCard({ item, selected, active, viewMode, onToggle, onOpen }) {
    const [copied, setCopied] = useState(false);
    const url = mediaUrl(item);
    const isVideo = item.mime_type?.startsWith('video/');

    function copyUrl(event) {
        event.stopPropagation();
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function remove(event) {
        event.stopPropagation();
        if (window.confirm('Delete this media item?')) {
            router.delete(`/admin/media/${item.id}`);
        }
    }

    if (viewMode === 'list') {
        return (
            <article
                className={`admin-media-list-row${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}`}
                onClick={() => onOpen(item)}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
                role="button"
                tabIndex={0}
            >
                <label className="admin-media-card-check" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => onToggle(item.id, e.target.checked)}
                    />
                </label>
                <div className="admin-media-list-thumb">
                    <MediaPreview item={item} />
                </div>
                <div className="admin-media-list-copy">
                    <p className="admin-media-card-name">{item.name}</p>
                    <p className="admin-media-card-detail">
                        {isVideo ? 'Video' : 'Image'} · {item.disk === 'cloudinary' ? 'Cloudinary' : 'Local'} · {formatSize(item.size)}
                    </p>
                </div>
                <div className="admin-media-list-actions">
                    <button type="button" className="admin-media-card-action" onClick={copyUrl}>
                        <RiFileCopyLine />
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button type="button" className="admin-media-card-action is-danger" onClick={remove}>
                        <RiDeleteBinLine />
                        <span>Delete</span>
                    </button>
                </div>
            </article>
        );
    }

    return (
        <article
            className={`admin-media-card${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}`}
            onClick={() => onOpen(item)}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
            role="button"
            tabIndex={0}
        >
            <div className="admin-media-card-preview">
                <label className="admin-media-card-check" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => onToggle(item.id, e.target.checked)}
                    />
                </label>
                <span className={`admin-media-card-badge${isVideo ? ' is-video' : ' is-image'}`}>
                    {isVideo ? <RiVideoLine /> : <RiImageLine />}
                    {isVideo ? 'Video' : 'Image'}
                </span>
                <MediaPreview item={item} />
                <div className="admin-media-card-overlay">
                    <button type="button" className="admin-media-card-action" onClick={copyUrl} title="Copy URL">
                        <RiFileCopyLine />
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button type="button" className="admin-media-card-action is-danger" onClick={remove} title="Delete">
                        <RiDeleteBinLine />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <div className="admin-media-card-meta">
                <p className="admin-media-card-name" title={item.name}>{item.name}</p>
                <p className="admin-media-card-detail">
                    {item.disk === 'cloudinary' ? 'Cloudinary' : 'Local'} · {formatSize(item.size)}
                </p>
            </div>
        </article>
    );
}

function UploadPanel({ form, fileRef, cloudinaryConnected, onFileChange, onDrop }) {
    const [dragging, setDragging] = useState(false);
    const previewUrl = form.data.upload_file && form.data.upload_file.type?.startsWith('image/')
        ? URL.createObjectURL(form.data.upload_file)
        : null;

    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    function handleDragOver(event) {
        event.preventDefault();
        setDragging(true);
    }

    function handleDragLeave() {
        setDragging(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        setDragging(false);
        onDrop(event.dataTransfer.files?.[0]);
    }

    return (
        <section className="admin-media-upload">
            <div className="admin-media-upload-head">
                <span className="admin-media-upload-icon"><RiUploadCloud2Line /></span>
                <div>
                    <h2>Upload Media</h2>
                    <p>Add images or videos to your library.</p>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="admin-media-upload-form">
                <div
                    className={`admin-media-dropzone${dragging ? ' is-dragging' : ''}${form.data.upload_file ? ' has-file' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Upload preview" className="admin-media-dropzone-preview" />
                    ) : (
                        <>
                            <RiUploadCloud2Line className="admin-media-dropzone-icon" />
                            <p className="admin-media-dropzone-title">
                                {form.data.upload_file ? form.data.upload_file.name : 'Drop file here or click to browse'}
                            </p>
                            <p className="admin-media-dropzone-hint">JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV — max 50MB</p>
                        </>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
                {form.errors.upload_file && <p className="admin-media-field-error">{form.errors.upload_file}</p>}

                <label className="admin-media-field">
                    <span>Display name</span>
                    <Input
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="Auto-filled from filename"
                    />
                </label>

                <label className="admin-media-field">
                    <span>Alt text</span>
                    <Input
                        value={form.data.alt_text}
                        onChange={(e) => form.setData('alt_text', e.target.value)}
                        placeholder="Optional accessibility text"
                    />
                </label>

                <button
                    type="button"
                    disabled={form.processing || !form.data.upload_file}
                    onClick={() => form.post('/admin/media', {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            form.reset();
                            if (fileRef.current) fileRef.current.value = '';
                        },
                    })}
                    className="admin-media-upload-btn"
                >
                    <RiCloudLine />
                    {form.processing ? 'Uploading…' : cloudinaryConnected ? 'Upload to Cloudinary' : 'Upload to Library'}
                </button>
            </form>
        </section>
    );
}

export default function MediaLibrary({ items, filters = {}, stats = {}, cloudinaryConnected }) {
    const fileRef = useRef(null);
    const form = useForm({ upload_file: null, name: '', alt_text: '' });
    const [selected, setSelected] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [search, setSearch] = useState(filters.search || '');
    const activeType = filters.type || 'all';
    const pageIds = items.data.map((item) => item.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search === (filters.search || '')) return;
            router.get('/admin/media', { search, type: activeType }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filters.search, activeType]);

    useEffect(() => {
        setSelected((current) => current.filter((id) => pageIds.includes(id)));
        if (activeItem && !pageIds.includes(activeItem.id)) {
            setActiveItem(null);
        }
    }, [pageIds.join(',')]);

    function setType(type) {
        router.get('/admin/media', { search, type }, { preserveState: true, preserveScroll: true });
    }

    function toggleItem(id, checked) {
        setSelected((current) => (checked ? [...current, id] : current.filter((entry) => entry !== id)));
    }

    function toggleAll(checked) {
        setSelected(checked ? pageIds : []);
    }

    function bulkDelete() {
        if (!selected.length) return;
        if (!window.confirm(`Delete ${selected.length} selected media item${selected.length === 1 ? '' : 's'}?`)) {
            return;
        }

        router.delete('/admin/media/bulk', {
            data: { ids: selected },
            preserveScroll: true,
            onSuccess: () => {
                setSelected([]);
                if (activeItem && selected.includes(activeItem.id)) {
                    setActiveItem(null);
                }
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

    function onDrop(file) {
        if (!file) return;
        form.setData('upload_file', file);
        if (!form.data.name) {
            form.setData('name', file.name.replace(/\.[^.]+$/, ''));
        }
    }

    function openItem(item) {
        setActiveItem(item);
    }

    return (
        <AdminLayout
            title="Media Library"
            subtitle="Organize, search, and reuse images and videos across your website."
        >
            {!cloudinaryConnected && (
                <div className="admin-media-alert is-warning">
                    Cloudinary is not connected. Uploads are stored locally until you configure{' '}
                    <Link href="/admin/cloudinary/settings">Cloudinary Settings</Link>.
                </div>
            )}

            <div className="admin-media-stats">
                <StatCard
                    icon={RiFolderImageLine}
                    label="All assets"
                    value={stats.total ?? items.total ?? 0}
                    active={activeType === 'all'}
                    onClick={() => setType('all')}
                />
                <StatCard
                    icon={RiImageLine}
                    label="Images"
                    value={stats.images ?? 0}
                    active={activeType === 'image'}
                    onClick={() => setType('image')}
                />
                <StatCard
                    icon={RiVideoLine}
                    label="Videos"
                    value={stats.videos ?? 0}
                    active={activeType === 'video'}
                    onClick={() => setType('video')}
                />
                <div className="admin-media-stat is-static">
                    <span className="admin-media-stat-icon"><RiCloudLine /></span>
                    <span className="admin-media-stat-copy">
                        <strong>{formatSize(stats.storage_bytes)}</strong>
                        <small>Library size</small>
                    </span>
                </div>
            </div>

            <div className={`admin-media-layout${activeItem ? ' has-detail' : ''}`}>
                <UploadPanel
                    form={form}
                    fileRef={fileRef}
                    cloudinaryConnected={cloudinaryConnected}
                    onFileChange={onFileChange}
                    onDrop={onDrop}
                />

                <div className="admin-media-workspace">
                    <section className="admin-media-library">
                        <div className="admin-media-toolbar">
                            <label className="admin-datatable-search admin-media-search">
                                <RiSearchLine />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or alt text…"
                                />
                            </label>

                            <div className="admin-media-toolbar-actions">
                                <div className="admin-media-view-toggle">
                                    <button
                                        type="button"
                                        className={viewMode === 'grid' ? 'is-active' : ''}
                                        onClick={() => setViewMode('grid')}
                                        title="Grid view"
                                    >
                                        <RiLayoutGridLine />
                                    </button>
                                    <button
                                        type="button"
                                        className={viewMode === 'list' ? 'is-active' : ''}
                                        onClick={() => setViewMode('list')}
                                        title="List view"
                                    >
                                        <RiListUnordered />
                                    </button>
                                </div>
                                {items.data.length > 0 && (
                                    <label className="admin-media-select-all">
                                        <input type="checkbox" checked={allSelected} onChange={(e) => toggleAll(e.target.checked)} />
                                        Select page
                                    </label>
                                )}
                                <span className="admin-media-count">
                                    <RiLayoutGridLine />
                                    {items.total} {items.total === 1 ? 'asset' : 'assets'}
                                </span>
                            </div>
                        </div>

                        {selected.length > 0 && (
                            <div className="admin-datatable-bulk admin-media-bulk">
                                <span>{selected.length} selected</span>
                                <div className="admin-datatable-bulk-actions">
                                    <button type="button" className="admin-datatable-bulk-clear" onClick={() => setSelected([])}>Clear</button>
                                    <button type="button" className="admin-datatable-bulk-delete" onClick={bulkDelete}>
                                        <RiDeleteBinLine /> Delete selected
                                    </button>
                                </div>
                            </div>
                        )}

                        {items.data.length === 0 ? (
                            <EmptyState
                                icon={RiImageLine}
                                title={search || activeType !== 'all' ? 'No matching media' : 'No media yet'}
                                body={search || activeType !== 'all'
                                    ? 'Try a different search or filter.'
                                    : 'Upload your first image or video using the panel on the left.'}
                            />
                        ) : (
                            <div className={viewMode === 'list' ? 'admin-media-list' : 'admin-media-grid'}>
                                {items.data.map((item) => (
                                    <MediaCard
                                        key={item.id}
                                        item={item}
                                        selected={selected.includes(item.id)}
                                        active={activeItem?.id === item.id}
                                        viewMode={viewMode}
                                        onToggle={toggleItem}
                                        onOpen={openItem}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="admin-media-footer">
                            <span>
                                Showing {items.data.length} of {items.total}
                                {items.last_page > 1 && ` · Page ${items.current_page} of ${items.last_page}`}
                            </span>
                            {(items.prev_page_url || items.next_page_url) && (
                                <div className="admin-media-pagination">
                                    {items.prev_page_url ? (
                                        <Link href={items.prev_page_url} className="admin-media-page-btn">
                                            <RiArrowLeftSLine /> Previous
                                        </Link>
                                    ) : (
                                        <span className="admin-media-page-btn is-disabled"><RiArrowLeftSLine /> Previous</span>
                                    )}
                                    {items.next_page_url ? (
                                        <Link href={items.next_page_url} className="admin-media-page-btn">
                                            Next <RiArrowRightSLine />
                                        </Link>
                                    ) : (
                                        <span className="admin-media-page-btn is-disabled">Next <RiArrowRightSLine /></span>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {activeItem && (
                        <MediaDetailPanel
                            item={activeItem}
                            onClose={() => setActiveItem(null)}
                            onDeleted={() => setActiveItem(null)}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
