import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { RiCloseLine, RiImageLine, RiSearchLine, RiVideoLine } from 'react-icons/ri';

function mediaUrl(item) {
    return item.secure_url || item.file_path || '';
}

export default function MediaPicker({ open, onClose, onSelect, multiple = false, selected = [] }) {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [picked, setPicked] = useState(selected);

    useEffect(() => {
        if (!open) return;
        setPicked(selected);
        setPage(1);
    }, [open, selected]);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setError('');
        axios.get('/admin/media/picker', { params: { search, page } })
            .then((response) => {
                setItems(response.data.data || []);
                setLastPage(response.data.last_page || 1);
            })
            .catch(() => {
                setItems([]);
                setError('Could not load media. Refresh and try again.');
            })
            .finally(() => setLoading(false));
    }, [open, search, page]);

    if (!open) return null;

    function toggle(item) {
        const payload = {
            url: mediaUrl(item),
            alt: item.alt_text || item.name,
            media: {
                secure_url: item.secure_url,
                file_path: item.file_path,
                mime_type: item.mime_type,
            },
        };

        if (multiple) {
            setPicked((current) => {
                const exists = current.find((entry) => entry.url === payload.url);
                return exists ? current.filter((entry) => entry.url !== payload.url) : [...current, payload];
            });
            return;
        }

        onSelect(payload);
        onClose();
    }

    function confirmMultiple() {
        onSelect(picked);
        onClose();
    }

    return createPortal(
        <div className="media-picker-overlay" onClick={onClose}>
            <div className="media-picker-modal" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-bold">Media Gallery</h3>
                        <p className="text-sm text-muted">Pick from your uploaded library</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-xl">
                        <RiCloseLine />
                    </button>
                </div>

                <div className="border-b border-white/10 px-5 py-3">
                    <label className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2">
                        <RiSearchLine className="text-muted" />
                        <input
                            className="w-full bg-transparent text-sm outline-none"
                            placeholder="Search media..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </label>
                </div>

                <div className="media-picker-grid">
                    {loading && <p className="col-span-full p-6 text-sm text-muted">Loading media...</p>}
                    {error && <p className="col-span-full p-6 text-sm text-rose-300">{error}</p>}
                    {!loading && !error && items.length === 0 && <p className="col-span-full p-6 text-sm text-muted">No media found. Upload files in Media Library first.</p>}
                    {items.map((item) => {
                        const url = mediaUrl(item);
                        const isVideo = item.mime_type?.startsWith('video/');
                        const active = multiple && picked.some((entry) => entry.url === url);
                        return (
                            <button key={item.id} type="button" className={`media-picker-item ${active ? 'is-selected' : ''}`} onClick={() => toggle(item)}>
                                {isVideo ? (
                                    <div className="grid h-full place-items-center bg-black/40 text-3xl text-white">
                                        <RiVideoLine />
                                    </div>
                                ) : url ? (
                                    <img src={url} alt={item.alt_text || item.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="grid h-full place-items-center text-3xl text-muted"><RiImageLine /></div>
                                )}
                                <span className="media-picker-item-label">{item.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
                    <div className="flex gap-2">
                        <button type="button" disabled={page <= 1} className="btn-outline rounded-full px-4 py-2 text-sm disabled:opacity-40" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
                        <button type="button" disabled={page >= lastPage} className="btn-outline rounded-full px-4 py-2 text-sm disabled:opacity-40" onClick={() => setPage((p) => p + 1)}>Next</button>
                    </div>
                    {multiple ? (
                        <button type="button" className="btn-primary rounded-full px-5 py-2 text-sm font-bold" onClick={confirmMultiple}>
                            Use {picked.length} selected
                        </button>
                    ) : (
                        <a href="/admin/media" target="_blank" className="text-sm text-primary hover:underline">Open Media Library</a>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
