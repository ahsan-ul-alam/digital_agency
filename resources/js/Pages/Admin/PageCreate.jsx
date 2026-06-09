import { useRef } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import ResourceEditorShell from '../../Components/Admin/ResourceEditorShell';
import { FieldShell } from '../../Components/Cms/fields';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';
import { RiLayoutMasonryLine } from 'react-icons/ri';

const tabs = [
    {
        id: 'content',
        title: 'Details',
        hint: 'Name and URL slug',
        sections: [{ id: 'details', title: 'Page details', description: 'Basic identity before opening AR Builder.' }],
    },
    {
        id: 'settings',
        title: 'Template',
        hint: 'Starter sections',
        sections: [{ id: 'template', title: 'Page template', description: 'Pre-built AR Builder sections you can customize after creation.' }],
    },
];

function slugify(value) {
    return String(value ?? '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function PageCreate({ templates = [] }) {
    const form = useForm({ name: '', slug: '', template: 'blank' });
    const slugTouched = useRef(false);

    function onNameChange(value) {
        form.setData('name', value);
        if (!slugTouched.current) {
            form.setData('slug', slugify(value));
        }
    }

    function submit(event) {
        event.preventDefault();
        form.post('/admin/pages');
    }

    const selectedTemplate = templates.find((t) => t.key === form.data.template);

    const sidebarExtra = selectedTemplate ? (
        <div className="resource-editor-shortcode">
            <p>Template</p>
            <code>{selectedTemplate.name}</code>
            <small>{selectedTemplate.description}</small>
        </div>
    ) : null;

    return (
        <AdminLayout title="Create Page" subtitle="Pick a starter template, then refine the page in AR Builder.">
            <ResourceEditorShell
                title="Pages"
                subtitle={form.data.name || 'New page'}
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/pages"
                statusLabel="Draft"
                saveLabel="Create & open AR Builder"
                sidebarExtra={sidebarExtra}
            >
                {(section) => {
                    if (section.id === 'details') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Page name" error={form.errors.name} wide>
                                    <Input value={form.data.name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. About Us" autoFocus />
                                </FieldShell>
                                <FieldShell label="URL slug" hint="Auto-generated from name when empty." error={form.errors.slug} wide>
                                    <Input
                                        value={form.data.slug}
                                        onChange={(e) => { slugTouched.current = true; form.setData('slug', e.target.value); }}
                                        placeholder="about-us"
                                    />
                                </FieldShell>
                            </div>
                        );
                    }

                    return (
                        <div className="admin-template-grid">
                            {templates.map((template) => (
                                <button
                                    key={template.key}
                                    type="button"
                                    className={`admin-template-card ${form.data.template === template.key ? 'is-active' : ''}`}
                                    onClick={() => form.setData('template', template.key)}
                                >
                                    <RiLayoutMasonryLine className="admin-template-icon" />
                                    <strong>{template.name}</strong>
                                    <p>{template.description}</p>
                                </button>
                            ))}
                        </div>
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
