import AdminLayout from '../../Layouts/AdminLayout';
import ResourceEditorShell from '../../Components/Admin/ResourceEditorShell';
import { FieldShell } from '../../Components/Cms/fields';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';

const colorGroups = [
    {
        id: 'brand',
        title: 'Brand Colors',
        description: 'Primary palette for buttons, links and highlights.',
        fields: [
            ['primary', 'Primary Color', 'Main buttons, links and highlights'],
            ['primary_hover', 'Primary Hover', 'Hover state for primary elements'],
            ['secondary', 'Secondary Color', 'Secondary accents and icons'],
            ['accent', 'Accent Color', 'Extra highlights and gradients'],
            ['button_text', 'Button Text', 'Text on primary buttons'],
        ],
    },
    {
        id: 'surfaces',
        title: 'Background & Surface',
        description: 'Page background, cards and typography colors.',
        fields: [
            ['background', 'Page Background', 'Main page background color'],
            ['surface', 'Surface / Cards', 'Card and panel backgrounds'],
            ['text', 'Primary Text', 'Headings and main text'],
            ['text_muted', 'Muted Text', 'Subtitles and descriptions'],
        ],
    },
    {
        id: 'gradients',
        title: 'Gradients & Glow',
        description: 'Hero gradients and ambient glow effects.',
        fields: [
            ['gradient_from', 'Gradient Start', 'Hero gradient text start color'],
            ['gradient_via', 'Gradient Middle', 'Hero gradient text middle color'],
            ['gradient_to', 'Gradient End', 'Hero gradient text end color'],
            ['glow_primary', 'Primary Glow RGB', 'RGB values e.g. 56, 189, 248'],
            ['glow_secondary', 'Secondary Glow RGB', 'RGB values e.g. 168, 85, 247'],
        ],
    },
];

const tabs = [
    { id: 'content', title: 'Brand', hint: 'Primary palette', sections: [colorGroups[0]] },
    { id: 'settings', title: 'Surfaces', hint: 'Backgrounds and text', sections: [colorGroups[1]] },
    { id: 'seo', title: 'Gradients', hint: 'Hero effects', sections: [colorGroups[2]] },
];

function ThemePreview({ theme }) {
    return (
        <div
            className="theme-preview-card"
            style={{
                background: `linear-gradient(135deg, ${theme.background}, ${theme.surface})`,
                color: theme.text,
            }}
        >
            <p className="theme-preview-eyebrow" style={{ color: theme.primary }}>Live preview</p>
            <p
                className="theme-preview-headline"
                style={{
                    background: `linear-gradient(120deg, ${theme.gradient_from}, ${theme.gradient_via}, ${theme.gradient_to})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                }}
            >
                Building Digital Solutions
            </p>
            <p className="theme-preview-copy" style={{ color: theme.text_muted }}>Buttons, cards and hero text update as you edit.</p>
            <button
                type="button"
                className="theme-preview-btn"
                style={{ background: theme.primary, color: theme.button_text }}
            >
                Get a Quote
            </button>
        </div>
    );
}

function ColorFields({ group, form }) {
    return (
        <div className="cms-form-grid">
            {group.fields.map(([field, label, hint]) => (
                <FieldShell key={field} label={label} hint={hint} error={form.errors[field]}>
                    <div className="theme-color-input">
                        {field.includes('glow') ? (
                            <Input
                                value={form.data[field]}
                                onChange={(e) => form.setData(field, e.target.value)}
                                placeholder="77, 143, 159"
                            />
                        ) : (
                            <>
                                <input
                                    type="color"
                                    className="theme-color-picker"
                                    value={form.data[field]}
                                    onChange={(e) => form.setData(field, e.target.value)}
                                />
                                <Input
                                    className="font-mono"
                                    value={form.data[field]}
                                    onChange={(e) => form.setData(field, e.target.value)}
                                />
                            </>
                        )}
                    </div>
                </FieldShell>
            ))}
        </div>
    );
}

export default function ThemeSettings({ theme }) {
    const form = useForm({ ...theme });

    function submit(e) {
        e.preventDefault();
        form.put('/admin/theme/settings');
    }

    return (
        <AdminLayout title="Theme & Colors" subtitle="Control brand colors, gradients and glow effects across the public website.">
            <ResourceEditorShell
                title="Theme"
                subtitle="Public site palette"
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                statusLabel="Live on site"
                sidebarExtra={<ThemePreview theme={form.data} />}
            >
                {(section) => {
                    const group = colorGroups.find((g) => g.id === section.id);
                    return group ? <ColorFields group={group} form={form} /> : null;
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
