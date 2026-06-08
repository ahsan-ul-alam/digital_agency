import { useRef, useState } from 'react';
import { Input, Select, Textarea, Checkbox } from '../Form';
import MediaPicker from '../PageBuilder/MediaPicker';
import RichTextEditor from './RichTextEditor';
import { RiAddLine, RiDeleteBinLine, RiDragMove2Line, RiImageLine, RiStarFill, RiStarLine, RiUploadCloud2Line } from 'react-icons/ri';

export function FieldShell({ label, hint, error, children, wide = false }) {
    return (
        <label className={`cms-field ${wide ? 'is-wide' : ''}`}>
            {label && <span className="cms-field-label">{label}</span>}
            {hint && <span className="cms-field-hint">{hint}</span>}
            {children}
            {error && <span className="cms-field-error">{error}</span>}
        </label>
    );
}

export function ToggleField({ label, hint, checked, onChange, error }) {
    return (
        <div className="cms-toggle-field">
            <div>
                <p className="cms-toggle-label">{label}</p>
                {hint && <p className="cms-toggle-hint">{hint}</p>}
            </div>
            <button
                type="button"
                className={`cms-toggle ${checked ? 'is-on' : ''}`}
                onClick={() => onChange(!checked)}
                aria-pressed={checked}
            >
                <span />
            </button>
            {error && <span className="cms-field-error">{error}</span>}
        </div>
    );
}

export function ListField({ label, hint, items = [], onChange, placeholder = 'Add item', error }) {
    function update(index, value) {
        onChange(items.map((row, i) => (i === index ? value : row)));
    }

    return (
        <FieldShell label={label} hint={hint} error={error} wide>
            <div className="cms-list-field">
                {items.map((item, index) => (
                    <div key={index} className="cms-list-row">
                        <RiDragMove2Line className="cms-list-drag" />
                        <Input value={item} onChange={(e) => update(index, e.target.value)} placeholder={placeholder} />
                        <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="cms-list-remove">
                            <RiDeleteBinLine />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => onChange([...items, ''])} className="cms-list-add">
                    <RiAddLine /> Add item
                </button>
            </div>
        </FieldShell>
    );
}

export function RepeaterField({ label, hint, items = [], fields, onChange, error }) {
    function updateItem(index, key, value) {
        onChange(items.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
    }

    function addItem() {
        const blank = Object.fromEntries(fields.map((field) => [field.key, field.default ?? '']));
        onChange([...items, blank]);
    }

    return (
        <FieldShell label={label} hint={hint} error={error} wide>
            <div className="cms-repeater">
                {items.map((item, index) => (
                    <div key={index} className="cms-repeater-card">
                        <div className="cms-repeater-card-head">
                            <strong>Item {index + 1}</strong>
                            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="cms-list-remove">
                                Remove
                            </button>
                        </div>
                        <div className="cms-repeater-grid">
                            {fields.map((field) => (
                                <FieldShell key={field.key} label={field.label} wide={field.wide}>
                                {field.type === 'richtext' ? (
                                    <RichTextEditor compact value={item[field.key] || ''} onChange={(next) => updateItem(index, field.key, next)} minHeight="7rem" />
                                ) : field.type === 'textarea' ? (
                                    <Textarea value={item[field.key] || ''} onChange={(e) => updateItem(index, field.key, e.target.value)} />
                                ) : (
                                        <Input value={item[field.key] || ''} onChange={(e) => updateItem(index, field.key, e.target.value)} placeholder={field.placeholder} />
                                    )}
                                </FieldShell>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="cms-list-add">
                    <RiAddLine /> Add row
                </button>
            </div>
        </FieldShell>
    );
}

export function SeoField({ value = {}, onChange, error }) {
    const data = { title: '', description: '', keywords: '', ...value };

    function set(key, val) {
        onChange({ ...data, [key]: val });
    }

    return (
        <div className="cms-seo-panel">
            <FieldShell label="Meta Title" hint="Shown in browser tabs and search results.">
                <Input value={data.title} onChange={(e) => set('title', e.target.value)} />
            </FieldShell>
            <FieldShell label="Meta Description" hint="Short summary for Google and social previews." wide>
                <Textarea className="min-h-24" value={data.description} onChange={(e) => set('description', e.target.value)} />
            </FieldShell>
            <FieldShell label="Keywords" hint="Comma-separated keywords for legacy SEO tools.">
                <Input value={data.keywords} onChange={(e) => set('keywords', e.target.value)} />
            </FieldShell>
            {error && <span className="cms-field-error">{error}</span>}
        </div>
    );
}

export function SocialField({ value = {}, onChange, error }) {
    const networks = [
        ['facebook', 'Facebook'],
        ['linkedin', 'LinkedIn'],
        ['github', 'GitHub'],
        ['twitter', 'X / Twitter'],
        ['instagram', 'Instagram'],
        ['dribbble', 'Dribbble'],
    ];

    function set(key, val) {
        onChange({ ...value, [key]: val });
    }

    return (
        <div className="cms-social-grid">
            {networks.map(([key, label]) => (
                <FieldShell key={key} label={label} hint="Use # as placeholder or full URL. Leave blank to hide.">
                    <Input value={value[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder="https://..." />
                </FieldShell>
            ))}
            {error && <span className="cms-field-error">{error}</span>}
        </div>
    );
}

export function RatingField({ label, value, onChange, error }) {
    return (
        <FieldShell label={label} error={error}>
            <div className="cms-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => onChange(star)} className="cms-rating-star">
                        {star <= (value || 0) ? <RiStarFill /> : <RiStarLine />}
                    </button>
                ))}
            </div>
        </FieldShell>
    );
}

export function MediaField({ label, hint, path, media, fileKey, onPathChange, onMediaChange, onFileChange, error, accept = 'image/*' }) {
    const inputRef = useRef(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const preview = path || media?.secure_url || media?.file_path || '';

    return (
        <FieldShell label={label} hint={hint} error={error} wide>
            <div className="cms-media-field">
                <div className="cms-media-preview" onClick={() => inputRef.current?.click()}>
                    {preview ? (
                        <img src={preview} alt={label} />
                    ) : (
                        <div className="cms-media-empty">
                            <RiImageLine />
                            <span>No image selected</span>
                        </div>
                    )}
                </div>
                <div className="cms-media-actions">
                    <button type="button" className="cms-media-btn" onClick={() => inputRef.current?.click()}>
                        <RiUploadCloud2Line /> Upload
                    </button>
                    <button type="button" className="cms-media-btn" onClick={() => setPickerOpen(true)}>
                        Choose from library
                    </button>
                    {preview && (
                        <button
                            type="button"
                            className="cms-media-btn is-muted"
                            onClick={() => {
                                onPathChange('');
                                onMediaChange?.(null);
                            }}
                        >
                            Remove
                        </button>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => onFileChange?.(e.target.files[0] || null)}
                />
            </div>
            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(payload) => {
                    onPathChange(payload.url);
                    onMediaChange?.(payload.media);
                }}
            />
        </FieldShell>
    );
}
