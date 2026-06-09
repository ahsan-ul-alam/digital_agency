import AdminLayout from '../../Layouts/AdminLayout';
import ResourceEditorShell from '../../Components/Admin/ResourceEditorShell';
import RichTextEditor from '../../Components/Cms/RichTextEditor';
import { FieldShell, ToggleField } from '../../Components/Cms/fields';
import { Input, Select, Textarea } from '../../Components/Form';
import { useForm } from '../../app';
import { RiAddLine, RiDeleteBinLine } from 'react-icons/ri';

const fieldTypes = [
    ['text', 'Text'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['number', 'Number'],
    ['textarea', 'Textarea'],
    ['select', 'Select'],
];

const tabs = [
    {
        id: 'content',
        title: 'Setup',
        hint: 'Name, shortcode and messages',
        sections: [{ id: 'setup', title: 'Form setup', description: 'Basic details shown in the admin and on the public form.' }],
    },
    {
        id: 'settings',
        title: 'Fields',
        hint: 'Inputs and validation',
        sections: [{ id: 'fields', title: 'Form fields', description: 'Drag-free field builder — add rows and embed via shortcode in AR Builder.' }],
    },
    {
        id: 'seo',
        title: 'Behavior',
        hint: 'Redirect and visibility',
        sections: [{ id: 'behavior', title: 'After submit', description: 'What happens when a visitor submits the form.' }],
    },
];

export default function FormBuilder({ form: existing }) {
    const form = useForm({
        name: existing?.name || '',
        shortcode: existing?.shortcode || '',
        fields: existing?.fields?.length ? existing.fields : [{ key: 'name', label: 'Name', type: 'text', required: true, options: '' }],
        submit_label: existing?.submit_label || 'Submit',
        success_message: existing?.success_message || 'Thank you. We received your submission.',
        redirect_url: existing?.redirect_url || '',
        is_active: existing?.is_active ?? true,
    });

    function updateField(index, key, value) {
        form.setData('fields', form.data.fields.map((field, fieldIndex) => (fieldIndex === index ? { ...field, [key]: value } : field)));
    }

    function addField() {
        form.setData('fields', [...form.data.fields, { key: `field_${form.data.fields.length + 1}`, label: 'New field', type: 'text', required: false, options: '' }]);
    }

    function removeField(index) {
        form.setData('fields', form.data.fields.filter((_, fieldIndex) => fieldIndex !== index));
    }

    function submit(event) {
        event.preventDefault();
        const payload = {
            ...form.data,
            fields: form.data.fields.map((field) => ({
                ...field,
                options: Array.isArray(field.options) ? field.options.join('\n') : field.options,
            })),
        };
        form.transform(() => payload);
        existing ? form.put(`/admin/forms/${existing.id}`) : form.post('/admin/forms');
    }

    const sidebarExtra = existing?.shortcode ? (
        <div className="resource-editor-shortcode">
            <p>Shortcode</p>
            <code>{existing.shortcode}</code>
            <small>Use in AR Builder → Form element.</small>
        </div>
    ) : null;

    return (
        <AdminLayout title={existing ? 'Edit Form' : 'Create Form'} subtitle="Build a form and use its shortcode inside AR Builder.">
            <ResourceEditorShell
                title="Form Builder"
                subtitle={form.data.name || 'New form'}
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/forms"
                statusLabel={form.data.is_active ? 'Active' : 'Draft'}
                sidebarExtra={sidebarExtra}
            >
                {(section) => {
                    if (section.id === 'setup') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Form name" error={form.errors.name} wide>
                                    <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Shortcode" hint="Auto-generated from name when empty.">
                                    <Input value={form.data.shortcode} onChange={(e) => form.setData('shortcode', e.target.value)} placeholder="Auto from name" />
                                </FieldShell>
                                <FieldShell label="Submit button label">
                                    <Input value={form.data.submit_label} onChange={(e) => form.setData('submit_label', e.target.value)} />
                                </FieldShell>
                            </div>
                        );
                    }

                    if (section.id === 'fields') {
                        return (
                            <div className="cms-repeater">
                                {form.data.fields.map((field, index) => (
                                    <div key={index} className="cms-repeater-card">
                                        <div className="cms-repeater-card-head">
                                            <strong>Field {index + 1}</strong>
                                            <button type="button" onClick={() => removeField(index)} className="cms-list-remove">
                                                <RiDeleteBinLine /> Remove
                                            </button>
                                        </div>
                                        <div className="cms-repeater-grid">
                                            <FieldShell label="Field key">
                                                <Input value={field.key} onChange={(e) => updateField(index, 'key', e.target.value)} />
                                            </FieldShell>
                                            <FieldShell label="Label">
                                                <Input value={field.label} onChange={(e) => updateField(index, 'label', e.target.value)} />
                                            </FieldShell>
                                            <FieldShell label="Type">
                                                <Select value={field.type} onChange={(e) => updateField(index, 'type', e.target.value)}>
                                                    {fieldTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                                </Select>
                                            </FieldShell>
                                            <ToggleField
                                                label="Required"
                                                checked={Boolean(field.required)}
                                                onChange={(checked) => updateField(index, 'required', checked)}
                                            />
                                            {field.type === 'select' && (
                                                <FieldShell label="Options (one per line)" wide>
                                                    <Textarea value={Array.isArray(field.options) ? field.options.join('\n') : (field.options || '')} onChange={(e) => updateField(index, 'options', e.target.value)} />
                                                </FieldShell>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addField} className="cms-list-add">
                                    <RiAddLine /> Add field
                                </button>
                            </div>
                        );
                    }

                    return (
                        <div className="cms-form-grid">
                            <FieldShell label="Success message" wide>
                                <RichTextEditor compact value={form.data.success_message} onChange={(next) => form.setData('success_message', next)} minHeight="6rem" />
                            </FieldShell>
                            <FieldShell label="Redirect URL (optional)" hint="Leave blank to show success message inline." wide>
                                <Input value={form.data.redirect_url} onChange={(e) => form.setData('redirect_url', e.target.value)} placeholder="/thank-you" />
                            </FieldShell>
                            <ToggleField
                                label="Active on site"
                                hint="Inactive forms cannot be submitted."
                                checked={form.data.is_active}
                                onChange={(v) => form.setData('is_active', v)}
                            />
                        </div>
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
