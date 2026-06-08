import AdminLayout from '../../Layouts/AdminLayout';
import { Input, Select, Textarea, Checkbox } from '../../Components/Form';
import { Link, useForm } from '../../app';

const fieldTypes = [
    ['text', 'Text'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['number', 'Number'],
    ['textarea', 'Textarea'],
    ['select', 'Select'],
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

    return (
        <AdminLayout title={existing ? 'Edit Form' : 'Create Form'} subtitle="Build a form and use its shortcode inside AR Builder.">
            <form onSubmit={submit} className="grid max-w-3xl gap-6">
                <div className="glass grid gap-5 rounded-3xl p-6 sm:grid-cols-2">
                    <label className="grid gap-2 sm:col-span-2">
                        <span className="text-sm font-semibold text-muted">Form Name</span>
                        <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </label>
                    <label className="grid gap-2">
                        <span className="text-sm font-semibold text-muted">Shortcode</span>
                        <Input value={form.data.shortcode} onChange={(e) => form.setData('shortcode', e.target.value)} placeholder="Auto from name" />
                    </label>
                    <label className="grid gap-2">
                        <span className="text-sm font-semibold text-muted">Submit Button</span>
                        <Input value={form.data.submit_label} onChange={(e) => form.setData('submit_label', e.target.value)} />
                    </label>
                    <label className="grid gap-2 sm:col-span-2">
                        <span className="text-sm font-semibold text-muted">Success Message</span>
                        <Textarea value={form.data.success_message} onChange={(e) => form.setData('success_message', e.target.value)} />
                    </label>
                    <label className="grid gap-2 sm:col-span-2">
                        <span className="text-sm font-semibold text-muted">Redirect URL (optional)</span>
                        <Input value={form.data.redirect_url} onChange={(e) => form.setData('redirect_url', e.target.value)} placeholder="/thank-you" />
                    </label>
                    <Checkbox label="Active" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                </div>

                <div className="glass grid gap-4 rounded-3xl p-6">
                    <h2 className="text-lg font-bold">Fields</h2>
                    {form.data.fields.map((field, index) => (
                        <div key={index} className="grid gap-3 rounded-2xl border border-white/10 p-4 sm:grid-cols-2">
                            <label className="grid gap-2">
                                <span className="text-xs font-semibold text-muted">Field Key</span>
                                <Input value={field.key} onChange={(e) => updateField(index, 'key', e.target.value)} />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-xs font-semibold text-muted">Label</span>
                                <Input value={field.label} onChange={(e) => updateField(index, 'label', e.target.value)} />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-xs font-semibold text-muted">Type</span>
                                <Select value={field.type} onChange={(e) => updateField(index, 'type', e.target.value)}>
                                    {fieldTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </Select>
                            </label>
                            <label className="flex items-end">
                                <Checkbox label="Required" checked={field.required} onChange={(e) => updateField(index, 'required', e.target.checked)} />
                            </label>
                            {field.type === 'select' && (
                                <label className="grid gap-2 sm:col-span-2">
                                    <span className="text-xs font-semibold text-muted">Options (one per line)</span>
                                    <Textarea value={Array.isArray(field.options) ? field.options.join('\n') : (field.options || '')} onChange={(e) => updateField(index, 'options', e.target.value)} />
                                </label>
                            )}
                            <div className="sm:col-span-2">
                                <button type="button" onClick={() => removeField(index)} className="text-sm text-rose-300">Remove field</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addField} className="btn-outline w-fit rounded-full px-4 py-2 text-sm">Add field</button>
                </div>

                {existing?.shortcode && (
                    <div className="rounded-2xl surface-dashed p-4 text-sm text-primary">
                        Use shortcode <strong>{existing.shortcode}</strong> in AR Builder → Form element.
                    </div>
                )}

                <div className="flex gap-3">
                    <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold">Save Form</button>
                    <Link href="/admin/forms" className="btn-outline rounded-full px-6 py-3">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
