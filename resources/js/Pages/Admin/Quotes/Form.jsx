import AdminLayout from '../../../Layouts/AdminLayout';
import ResourceEditorShell from '../../../Components/Admin/ResourceEditorShell';
import RichTextEditor from '../../../Components/Cms/RichTextEditor';
import { FieldShell, ToggleField } from '../../../Components/Cms/fields';
import { Input } from '../../../Components/Form';
import { useForm } from '../../../app';

const tabs = [
    {
        id: 'content',
        title: 'Pricing',
        hint: 'Name, price and description',
        sections: [{ id: 'pricing', title: 'Quote type', description: 'Configure how this option appears on the public quote calculator.' }],
    },
    {
        id: 'settings',
        title: 'Visibility',
        hint: 'Active on public site',
        sections: [{ id: 'visibility', title: 'Publication', description: 'Control whether clients can select this quote type.' }],
    },
];

export default function QuoteForm({ type }) {
    const form = useForm({
        name: type.name,
        description: type.description || '',
        base_price: type.base_price,
        currency: type.currency || 'BDT',
        is_active: type.is_active,
        options: type.options || [],
    });

    function submit(e) {
        e.preventDefault();
        form.put(`/admin/quotes/${type.id}`);
    }

    return (
        <AdminLayout title={`Configure ${type.name}`} subtitle="Adjust base price and pricing options for the public calculator.">
            <ResourceEditorShell
                title="Quote Types"
                subtitle={type.name}
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/quotes"
                statusLabel={form.data.is_active ? 'Active' : 'Hidden'}
            >
                {(section) => {
                    if (section.id === 'pricing') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Name"><Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /></FieldShell>
                                <FieldShell label="Base price"><Input type="number" value={form.data.base_price} onChange={(e) => form.setData('base_price', e.target.value)} /></FieldShell>
                                <FieldShell label="Currency"><Input value={form.data.currency} onChange={(e) => form.setData('currency', e.target.value)} /></FieldShell>
                                <FieldShell label="Description" wide>
                                    <RichTextEditor compact value={form.data.description} onChange={(next) => form.setData('description', next)} minHeight="6rem" />
                                </FieldShell>
                                <p className="cms-field-hint is-wide">Advanced option tiers are managed via the database seeder structure.</p>
                            </div>
                        );
                    }

                    return (
                        <ToggleField
                            label="Active on public calculator"
                            hint="When off, this quote type is hidden from /quote."
                            checked={form.data.is_active}
                            onChange={(v) => form.setData('is_active', v)}
                        />
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
