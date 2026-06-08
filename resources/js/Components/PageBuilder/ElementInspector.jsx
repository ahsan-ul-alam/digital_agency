import { useState } from 'react';
import { Input, Select, Textarea } from '../Form';
import RichTextEditor from '../Cms/RichTextEditor';
import MediaPicker from './MediaPicker';
import { getBlockDefinition } from './blocks';

function RepeaterField({ field, value = [], onChange }) {
    const items = Array.isArray(value) ? value : [];
    const [picker, setPicker] = useState({ open: false, index: null, key: null });

    function updateItem(index, key, nextValue) {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: nextValue } : item)));
    }

    function addItem() {
        const blank = Object.fromEntries((field.itemFields || []).map((itemField) => [itemField.key, itemField.type === 'media' ? '' : '']));
        onChange([...items, blank]);
    }

    function removeItem(index) {
        onChange(items.filter((_, itemIndex) => itemIndex !== index));
    }

    return (
        <div className="grid gap-4">
            {items.map((item, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Item {index + 1}</p>
                        <button type="button" onClick={() => removeItem(index)} className="text-xs text-rose-300 hover:text-rose-200">Remove</button>
                    </div>
                    <div className="grid gap-3">
                        {(field.itemFields || []).map((itemField) => (
                            <label key={itemField.key} className="grid gap-1.5">
                                <span className="text-xs font-medium text-muted">{itemField.label}</span>
                                {itemField.type === 'media' ? (
                                    <div className="grid gap-2">
                                        {item[itemField.key] && <img src={item[itemField.key]} alt="" className="h-24 w-full rounded-xl object-cover" />}
                                        <button type="button" className="btn-outline rounded-full px-4 py-2 text-xs" onClick={() => setPicker({ open: true, index, key: itemField.key })}>
                                            {item[itemField.key] ? 'Change from gallery' : 'Pick from gallery'}
                                        </button>
                                    </div>
                                ) : itemField.type === 'richtext' ? (
                                    <RichTextEditor compact value={item[itemField.key] || ''} onChange={(next) => updateItem(index, itemField.key, next)} minHeight="7rem" />
                                ) : itemField.type === 'textarea' ? (
                                    <Textarea className="min-h-20" value={item[itemField.key] || ''} onChange={(e) => updateItem(index, itemField.key, e.target.value)} />
                                ) : (
                                    <Input value={item[itemField.key] || ''} onChange={(e) => updateItem(index, itemField.key, e.target.value)} />
                                )}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button type="button" onClick={addItem} className="btn-outline rounded-full px-4 py-2 text-sm">Add {field.label}</button>
            <MediaPicker
                open={picker.open}
                onClose={() => setPicker({ open: false, index: null, key: null })}
                onSelect={(media) => {
                    if (picker.index === null) return;
                    const itemIndex = picker.index;
                    const fieldKey = picker.key;
                    onChange(items.map((item, index) => {
                        if (index !== itemIndex) return item;
                        const next = { ...item, [fieldKey]: media.url };
                        if (fieldKey === 'url') {
                            if (!item.alt) next.alt = media.alt;
                            next.media = media.media;
                        }
                        return next;
                    }));
                    setPicker({ open: false, index: null, key: null });
                }}
            />
        </div>
    );
}

function FieldControl({ field, value, onChange, forms = [], onOpenMedia }) {
    if (field.type === 'richtext') {
        return <RichTextEditor value={value || ''} onChange={onChange} compact minHeight="10rem" />;
    }

    if (field.type === 'textarea') {
        return <Textarea value={value || ''} onChange={(e) => onChange(e.target.value)} />;
    }

    if (field.type === 'select') {
        return (
            <Select value={value || field.options?.[0]?.value || ''} onChange={(e) => onChange(e.target.value)}>
                {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </Select>
        );
    }

    if (field.type === 'repeater') {
        return <RepeaterField field={field} value={value} onChange={onChange} />;
    }

    if (field.type === 'media') {
        return (
            <div className="grid gap-2">
                {value && <img src={value} alt="" className="h-28 w-full rounded-2xl object-cover" />}
                <button type="button" className="btn-outline rounded-full px-4 py-2 text-sm" onClick={onOpenMedia}>
                    {value ? 'Change from gallery' : 'Pick from gallery'}
                </button>
            </div>
        );
    }

    if (field.type === 'form_select') {
        return (
            <Select value={value || ''} onChange={(e) => onChange(e.target.value)}>
                <option value="">Select a form...</option>
                {forms.map((form) => (
                    <option key={form.id} value={form.shortcode}>{form.name} ({form.shortcode})</option>
                ))}
            </Select>
        );
    }

    return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} />;
}

export default function ElementInspector({ block, activeTab, onTabChange, onUpdate, onUpdateStyle, forms = [] }) {
    const [mediaPicker, setMediaPicker] = useState({ open: false, key: null });

    if (!block) {
        return (
            <div className="page-builder-inspector">
                <p className="text-sm text-muted">Select an element on the canvas to edit content and style.</p>
            </div>
        );
    }

    const definition = getBlockDefinition(block.type);
    const fields = activeTab === 'style' ? definition.styleFields : definition.contentFields;

    return (
        <div className="page-builder-inspector">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{definition.label}</p>
                <p className="mt-1 text-sm text-muted">{definition.description}</p>
            </div>

            <div className="page-builder-tabs">
                <button type="button" className={activeTab === 'content' ? 'is-active' : ''} onClick={() => onTabChange('content')}>Content</button>
                <button type="button" className={activeTab === 'style' ? 'is-active' : ''} onClick={() => onTabChange('style')}>Style</button>
            </div>

            <div className="mt-4 grid gap-4">
                {fields.length === 0 && <p className="text-sm text-muted">{activeTab === 'style' ? 'Minimal style options for this element.' : 'No content fields for this element.'}</p>}
                {fields.map((field) => (
                    <label key={field.key} className="grid gap-2">
                        <span className="text-sm font-semibold text-muted">{field.label}</span>
                        <FieldControl
                            field={field}
                            forms={forms}
                            value={activeTab === 'style' ? block.styles?.[field.key] : block[field.key]}
                            onChange={(nextValue) => {
                                if (activeTab === 'style') {
                                    onUpdateStyle(field.key, nextValue);
                                    return;
                                }
                                onUpdate(field.key, nextValue);
                            }}
                            onOpenMedia={() => setMediaPicker({ open: true, key: field.key })}
                        />
                    </label>
                ))}
            </div>

            <MediaPicker
                open={mediaPicker.open}
                onClose={() => setMediaPicker({ open: false, key: null })}
                onSelect={(media) => {
                    if (!mediaPicker.key) return;
                    onUpdate(mediaPicker.key, media.url);
                    if (mediaPicker.key === 'url') {
                        onUpdate('media', media.media);
                        if (!block.alt) onUpdate('alt', media.alt);
                    }
                    if (mediaPicker.key === 'poster') {
                        onUpdate('poster', media.url);
                    }
                }}
            />
        </div>
    );
}
