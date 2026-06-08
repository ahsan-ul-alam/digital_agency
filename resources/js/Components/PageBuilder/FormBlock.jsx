import { Input, Select, Textarea } from '../Form';
import RichTextContent from '../Cms/RichTextContent';
import { useForm } from '../../app';

export default function FormBlock({ form, title, description, preview = false }) {
    const inertiaForm = useForm(
        Object.fromEntries((form?.fields || []).map((field) => [field.key, ''])),
    );

    if (!form) {
        return (
            <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-muted">
                {preview ? 'Select a form shortcode in the inspector.' : 'Form not found.'}
            </div>
        );
    }

    function submit(event) {
        event.preventDefault();
        if (preview) return;
        inertiaForm.post(`/forms/${form.shortcode}`);
    }

    return (
        <div className="glass rounded-[2rem] p-6 md:p-8">
            {title && <h3 className="text-2xl font-bold">{title}</h3>}
            {description && <RichTextContent html={description} className="mt-2 text-muted" />}
            <form onSubmit={submit} className="mt-6 grid gap-4">
                {(form.fields || []).map((field) => (
                    <label key={field.key} className="grid gap-2">
                        <span className="text-sm font-semibold text-muted">{field.label}</span>
                        {field.type === 'textarea' ? (
                            <Textarea value={inertiaForm.data[field.key]} onChange={(e) => inertiaForm.setData(field.key, e.target.value)} />
                        ) : field.type === 'select' ? (
                            <Select value={inertiaForm.data[field.key]} onChange={(e) => inertiaForm.setData(field.key, e.target.value)}>
                                <option value="">Select...</option>
                                {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
                            </Select>
                        ) : (
                            <Input
                                type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                                value={inertiaForm.data[field.key]}
                                onChange={(e) => inertiaForm.setData(field.key, e.target.value)}
                            />
                        )}
                        {inertiaForm.errors[field.key] && <span className="text-sm text-rose-300">{inertiaForm.errors[field.key]}</span>}
                    </label>
                ))}
                <button disabled={inertiaForm.processing || preview} className="btn-primary w-fit rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60">
                    {form.submit_label || 'Submit'}
                </button>
            </form>
        </div>
    );
}
