import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import AdminLayout from '../../Layouts/AdminLayout';
import { Input, Select, Checkbox } from '../../Components/Form';
import { useForm } from '../../app';
import { RiAddLine, RiDeleteBinLine, RiDragMove2Line } from 'react-icons/ri';

function newItem(label = 'New link', url = '/') {
    return {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label,
        url,
        target: '_self',
        is_active: true,
    };
}

function SortableMenuItem({ item, onChange, onRemove, dragControls, quickLinks }) {
    return (
        <Reorder.Item value={item} dragListener={false} dragControls={dragControls} className="menu-item-card list-none">
            <button type="button" className="menu-drag-handle" onPointerDown={(e) => dragControls.start(e)}>
                <RiDragMove2Line />
            </button>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                    <span className="text-xs font-medium text-muted">Label</span>
                    <Input value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} />
                </label>
                <label className="grid gap-1">
                    <span className="text-xs font-medium text-muted">URL</span>
                    <Input value={item.url} onChange={(e) => onChange({ ...item, url: e.target.value })} placeholder="/about or https://..." />
                </label>
                <label className="grid gap-1">
                    <span className="text-xs font-medium text-muted">Open in</span>
                    <Select value={item.target || '_self'} onChange={(e) => onChange({ ...item, target: e.target.value })}>
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                    </Select>
                </label>
                <label className="flex items-end">
                    <Checkbox label="Visible" checked={item.is_active !== false} onChange={(e) => onChange({ ...item, is_active: e.target.checked })} />
                </label>
            </div>
            <div className="grid gap-2">
                <Select
                    value=""
                    onChange={(e) => {
                        if (!e.target.value) return;
                        const link = quickLinks.find((entry) => entry.url === e.target.value);
                        if (link) onChange({ ...item, label: link.label, url: link.url });
                    }}
                >
                    <option value="">Insert quick link...</option>
                    {quickLinks.map((link) => (
                        <option key={link.url} value={link.url}>{link.label}</option>
                    ))}
                </Select>
                <button type="button" onClick={onRemove} className="text-sm text-rose-300 hover:text-rose-200">
                    <RiDeleteBinLine className="inline" /> Remove
                </button>
            </div>
        </Reorder.Item>
    );
}

function MenuItemList({ items, onChange, quickLinks }) {
    function SortableRow({ item }) {
        const dragControls = useDragControls();
        return (
            <SortableMenuItem
                item={item}
                dragControls={dragControls}
                quickLinks={quickLinks}
                onChange={(next) => onChange(items.map((row) => (row.id === item.id ? next : row)))}
                onRemove={() => onChange(items.filter((row) => row.id !== item.id))}
            />
        );
    }

    return (
        <div className="grid gap-3">
            <Reorder.Group axis="y" values={items} onReorder={onChange} className="grid gap-3">
                {items.map((item) => <SortableRow key={item.id} item={item} />)}
            </Reorder.Group>
            <button type="button" onClick={() => onChange([...items, newItem()])} className="btn-outline inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm">
                <RiAddLine /> Add menu item
            </button>
        </div>
    );
}

export default function MenuManagement({ menus, pageLinks, systemLinks }) {
    const quickLinks = [...systemLinks, ...pageLinks];
    const form = useForm({ menus });
    const [tab, setTab] = useState('header');

    function updateHeaderItems(items) {
        form.setData('menus', { ...form.data.menus, header: { ...form.data.menus.header, items } });
    }

    function updateCta(field, value) {
        form.setData('menus', {
            ...form.data.menus,
            header: { ...form.data.menus.header, cta: { ...form.data.menus.header.cta, [field]: value } },
        });
    }

    function updateFooter(field, value) {
        form.setData('menus', { ...form.data.menus, footer: { ...form.data.menus.footer, [field]: value } });
    }

    function updateFooterColumn(index, column) {
        const columns = [...form.data.menus.footer.columns];
        columns[index] = column;
        updateFooter('columns', columns);
    }

    function addFooterColumn() {
        updateFooter('columns', [
            ...form.data.menus.footer.columns,
            { id: `col-${Date.now()}`, title: 'New Column', items: [newItem()] },
        ]);
    }

    function removeFooterColumn(index) {
        updateFooter('columns', form.data.menus.footer.columns.filter((_, i) => i !== index));
    }

    function submit(event) {
        event.preventDefault();
        form.put('/admin/menus');
    }

    const tabs = [
        ['header', 'Header Menu'],
        ['cta', 'Header CTA'],
        ['footer', 'Footer'],
    ];

    return (
        <AdminLayout title="Menu Management" subtitle="Control header navigation, footer columns, and call-to-action buttons.">
            <form onSubmit={submit} className="grid max-w-5xl gap-6">
                <div className="menu-tabs">
                    {tabs.map(([key, label]) => (
                        <button key={key} type="button" className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'header' && (
                    <div className="glass rounded-3xl p-6">
                        <h2 className="mb-4 text-lg font-bold">Header Navigation</h2>
                        <p className="mb-5 text-sm text-muted">Drag to reorder. Only visible items appear in the site header and mobile menu.</p>
                        <MenuItemList items={form.data.menus.header.items} onChange={updateHeaderItems} quickLinks={quickLinks} />
                    </div>
                )}

                {tab === 'cta' && (
                    <div className="glass grid gap-4 rounded-3xl p-6 sm:grid-cols-2">
                        <h2 className="text-lg font-bold sm:col-span-2">Header Call-to-Action Button</h2>
                        <label className="grid gap-2">
                            <span className="text-sm font-semibold text-muted">Button Label</span>
                            <Input value={form.data.menus.header.cta.label} onChange={(e) => updateCta('label', e.target.value)} />
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm font-semibold text-muted">Button URL</span>
                            <Input value={form.data.menus.header.cta.url} onChange={(e) => updateCta('url', e.target.value)} />
                        </label>
                        <Checkbox
                            label="Show CTA button in header"
                            checked={form.data.menus.header.cta.is_active !== false}
                            onChange={(e) => updateCta('is_active', e.target.checked)}
                        />
                    </div>
                )}

                {tab === 'footer' && (
                    <div className="grid gap-5">
                        <div className="glass grid gap-4 rounded-3xl p-6 sm:grid-cols-2">
                            <h2 className="text-lg font-bold sm:col-span-2">Footer Options</h2>
                            <Checkbox
                                label="Show logo in footer"
                                checked={form.data.menus.footer.show_logo !== false}
                                onChange={(e) => updateFooter('show_logo', e.target.checked)}
                            />
                            <Checkbox
                                label="Show social links below logo"
                                checked={form.data.menus.footer.show_social !== false}
                                onChange={(e) => updateFooter('show_social', e.target.checked)}
                            />
                            <Checkbox
                                label="Show contact block in footer"
                                checked={form.data.menus.footer.show_contact !== false}
                                onChange={(e) => updateFooter('show_contact', e.target.checked)}
                            />
                            <label className="grid gap-2 sm:col-span-2">
                                <span className="text-sm font-semibold text-muted">Custom copyright (optional)</span>
                                <Input
                                    value={form.data.menus.footer.copyright || ''}
                                    onChange={(e) => updateFooter('copyright', e.target.value)}
                                    placeholder="Leave empty to use default copyright line"
                                />
                            </label>
                        </div>

                        {form.data.menus.footer.columns.map((column, index) => (
                            <div key={column.id} className="glass rounded-3xl p-6">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <label className="grid flex-1 gap-1">
                                        <span className="text-xs font-medium text-muted">Column title</span>
                                        <Input
                                            value={column.title}
                                            onChange={(e) => updateFooterColumn(index, { ...column, title: e.target.value })}
                                        />
                                    </label>
                                    {form.data.menus.footer.columns.length > 1 && (
                                        <button type="button" onClick={() => removeFooterColumn(index)} className="text-sm text-rose-300">
                                            Remove column
                                        </button>
                                    )}
                                </div>
                                <MenuItemList
                                    items={column.items}
                                    onChange={(items) => updateFooterColumn(index, { ...column, items })}
                                    quickLinks={quickLinks}
                                />
                            </div>
                        ))}

                        <button type="button" onClick={addFooterColumn} className="btn-outline inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm">
                            <RiAddLine /> Add footer column
                        </button>
                    </div>
                )}

                <button disabled={form.processing} className="btn-primary w-fit rounded-full px-6 py-3 font-bold disabled:opacity-60">
                    Save Menus
                </button>
            </form>
        </AdminLayout>
    );
}
