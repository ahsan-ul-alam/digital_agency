import { Reorder, useDragControls } from 'framer-motion';
import AdminLayout from '../../Layouts/AdminLayout';
import SalesEditorShell from '../../Components/Admin/SalesEditorShell';
import { FieldShell, ToggleField } from '../../Components/Cms/fields';
import { Input, Select } from '../../Components/Form';
import { useForm } from '../../app';
import { RiAddLine, RiDeleteBinLine, RiDragMove2Line, RiLayoutTopLine, RiLink, RiMenuLine } from 'react-icons/ri';

const TABS = [
    { id: 'header', title: 'Header', hint: 'Main navigation links', icon: RiMenuLine, panelTitle: 'Header navigation', panelHint: 'Drag to reorder. Only visible items appear in the site header.' },
    { id: 'cta', title: 'CTA', hint: 'Header call-to-action', icon: RiLink, panelTitle: 'Header CTA button', panelHint: 'Primary action button in the navigation bar.' },
    { id: 'footer', title: 'Footer', hint: 'Columns and options', icon: RiLayoutTopLine, panelTitle: 'Footer menus', panelHint: 'Footer columns, logo, social and contact blocks.' },
];

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
        <Reorder.Item value={item} dragListener={false} dragControls={dragControls} className="menu-item-card resource-editor-card">
            <button type="button" className="menu-drag-handle" onPointerDown={(e) => dragControls.start(e)}>
                <RiDragMove2Line />
            </button>
            <div className="cms-form-grid menu-item-grid">
                <FieldShell label="Label">
                    <Input value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} />
                </FieldShell>
                <FieldShell label="URL" hint="Path or full URL.">
                    <Input value={item.url} onChange={(e) => onChange({ ...item, url: e.target.value })} placeholder="/about" />
                </FieldShell>
                <FieldShell label="Open in">
                    <Select value={item.target || '_self'} onChange={(e) => onChange({ ...item, target: e.target.value })}>
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                    </Select>
                </FieldShell>
                <ToggleField label="Visible" checked={item.is_active !== false} onChange={(v) => onChange({ ...item, is_active: v })} />
            </div>
            <div className="menu-item-actions">
                <Select
                    value=""
                    onChange={(e) => {
                        if (!e.target.value) return;
                        const link = quickLinks.find((entry) => entry.url === e.target.value);
                        if (link) onChange({ ...item, label: link.label, url: link.url });
                    }}
                >
                    <option value="">Insert quick link…</option>
                    {quickLinks.map((link) => (
                        <option key={link.url} value={link.url}>{link.label}</option>
                    ))}
                </Select>
                <button type="button" onClick={onRemove} className="cms-list-remove">
                    <RiDeleteBinLine /> Remove
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
        <div className="menu-item-list">
            <Reorder.Group axis="y" values={items} onReorder={onChange} className="menu-item-list-group">
                {items.map((item) => <SortableRow key={item.id} item={item} />)}
            </Reorder.Group>
            <button type="button" onClick={() => onChange([...items, newItem()])} className="cms-list-add">
                <RiAddLine /> Add menu item
            </button>
        </div>
    );
}

export default function MenuManagement({ menus, pageLinks, systemLinks }) {
    const quickLinks = [...systemLinks, ...pageLinks];
    const form = useForm({ menus });

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

    const visibleHeader = form.data.menus.header.items.filter((i) => i.is_active !== false).length;

    return (
        <AdminLayout title="Menu Management" subtitle="Control header navigation, footer columns, and call-to-action buttons.">
            <SalesEditorShell
                title="Menus"
                subtitle="Site navigation"
                tabs={TABS}
                onSubmit={submit}
                processing={form.processing}
                statusLabel={`${visibleHeader} header links`}
                saveLabel="Save menus"
            >
                {(tab) => {
                    if (tab === 'header') {
                        return <MenuItemList items={form.data.menus.header.items} onChange={updateHeaderItems} quickLinks={quickLinks} />;
                    }

                    if (tab === 'cta') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Button label">
                                    <Input value={form.data.menus.header.cta.label} onChange={(e) => updateCta('label', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Button URL">
                                    <Input value={form.data.menus.header.cta.url} onChange={(e) => updateCta('url', e.target.value)} />
                                </FieldShell>
                                <ToggleField
                                    label="Show CTA in header"
                                    checked={form.data.menus.header.cta.is_active !== false}
                                    onChange={(v) => updateCta('is_active', v)}
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="menu-footer-editor">
                            <div className="cms-form-grid">
                                <ToggleField label="Show logo in footer" checked={form.data.menus.footer.show_logo !== false} onChange={(v) => updateFooter('show_logo', v)} />
                                <ToggleField label="Show social links" checked={form.data.menus.footer.show_social !== false} onChange={(v) => updateFooter('show_social', v)} />
                                <ToggleField label="Show contact block" checked={form.data.menus.footer.show_contact !== false} onChange={(v) => updateFooter('show_contact', v)} />
                                <FieldShell label="Custom copyright" hint="Leave empty for default." wide>
                                    <Input value={form.data.menus.footer.copyright || ''} onChange={(e) => updateFooter('copyright', e.target.value)} />
                                </FieldShell>
                            </div>

                            {form.data.menus.footer.columns.map((column, index) => (
                                <section key={column.id} className="resource-editor-card menu-footer-column">
                                    <header className="resource-editor-card-head">
                                        <FieldShell label="Column title">
                                            <Input value={column.title} onChange={(e) => updateFooterColumn(index, { ...column, title: e.target.value })} />
                                        </FieldShell>
                                        {form.data.menus.footer.columns.length > 1 && (
                                            <button type="button" onClick={() => removeFooterColumn(index)} className="cms-list-remove">Remove column</button>
                                        )}
                                    </header>
                                    <div className="resource-editor-card-body">
                                        <MenuItemList
                                            items={column.items}
                                            onChange={(items) => updateFooterColumn(index, { ...column, items })}
                                            quickLinks={quickLinks}
                                        />
                                    </div>
                                </section>
                            ))}

                            <button type="button" onClick={addFooterColumn} className="cms-list-add">
                                <RiAddLine /> Add footer column
                            </button>
                        </div>
                    );
                }}
            </SalesEditorShell>
        </AdminLayout>
    );
}
