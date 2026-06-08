import AdminLayout from '../../Layouts/AdminLayout';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';

const groups = [
    {
        title: 'Brand Colors',
        fields: [
            ['primary', 'Primary Color', 'Main buttons, links and highlights'],
            ['primary_hover', 'Primary Hover', 'Hover state for primary elements'],
            ['secondary', 'Secondary Color', 'Secondary accents and icons'],
            ['accent', 'Accent Color', 'Extra highlights and gradients'],
            ['button_text', 'Button Text', 'Text on primary buttons'],
        ],
    },
    {
        title: 'Background & Surface',
        fields: [
            ['background', 'Page Background', 'Main page background color'],
            ['surface', 'Surface / Cards', 'Card and glass panel backgrounds'],
            ['text', 'Primary Text', 'Headings and main text'],
            ['text_muted', 'Muted Text', 'Subtitles and descriptions'],
        ],
    },
    {
        title: 'Gradients & Glow',
        fields: [
            ['gradient_from', 'Gradient Start', 'Hero gradient text start color'],
            ['gradient_via', 'Gradient Middle', 'Hero gradient text middle color'],
            ['gradient_to', 'Gradient End', 'Hero gradient text end color'],
            ['glow_primary', 'Primary Glow RGB', 'RGB values e.g. 56, 189, 248'],
            ['glow_secondary', 'Secondary Glow RGB', 'RGB values e.g. 168, 85, 247'],
        ],
    },
];

export default function ThemeSettings({ theme }) {
    const form = useForm({ ...theme });

    function submit(e) {
        e.preventDefault();
        form.put('/admin/theme/settings');
    }

    function resetDefaults() {
        form.setData(theme);
    }

    return (
        <AdminLayout title="Theme & Colors" subtitle="Control brand colors, gradients and glow effects across the entire public website.">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="glass rounded-3xl p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Brand Identity</p>
                    <h2 className="mt-4 text-3xl font-black">Control your website colors</h2>
                    <p className="mt-4 leading-7 text-muted">
                        Every color on the public website uses CSS variables driven by these settings. Change primary, secondary, backgrounds and gradients — updates appear instantly across the homepage, navigation, buttons and cards.
                    </p>
                    <div
                        className="mt-6 rounded-2xl border border-white/10 p-6"
                        style={{
                            background: `linear-gradient(135deg, ${form.data.background}, ${form.data.surface})`,
                            color: form.data.text,
                        }}
                    >
                        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: form.data.primary }}>Preview</p>
                        <p
                            className="mt-3 text-2xl font-black"
                            style={{ background: `linear-gradient(120deg, ${form.data.gradient_from}, ${form.data.gradient_via}, ${form.data.gradient_to})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
                        >
                            Building Digital Solutions
                        </p>
                        <p className="mt-2 text-sm" style={{ color: form.data.text_muted }}>Live preview of your current palette.</p>
                        <button type="button" className="mt-4 rounded-full px-5 py-2 text-sm font-bold" style={{ background: form.data.primary, color: form.data.button_text }}>
                            Get a Quote
                        </button>
                    </div>
                </div>

                <form onSubmit={submit} className="glass grid gap-6 rounded-3xl p-6">
                    {groups.map((group) => (
                        <div key={group.title}>
                            <h3 className="mb-4 text-lg font-bold text-white">{group.title}</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {group.fields.map(([field, label, hint]) => (
                                    <label key={field} className="grid gap-2">
                                        <span className="text-sm font-semibold text-muted">{label}</span>
                                        <div className="flex items-center gap-3">
                                            {field.includes('glow') ? (
                                                <Input
                                                    className="w-full"
                                                    value={form.data[field]}
                                                    onChange={(e) => form.setData(field, e.target.value)}
                                                    placeholder="77, 143, 159"
                                                />
                                            ) : (
                                                <>
                                                    <input
                                                        type="color"
                                                        className="color-picker h-11 w-14"
                                                        value={form.data[field]}
                                                        onChange={(e) => form.setData(field, e.target.value)}
                                                    />
                                                    <Input
                                                        className="w-full font-mono"
                                                        value={form.data[field]}
                                                        onChange={(e) => form.setData(field, e.target.value)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        {hint && <span className="text-xs text-muted">{hint}</span>}
                                        {form.errors[field] && <span className="text-sm text-rose-300">{form.errors[field]}</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-wrap gap-3">
                        <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">
                            Save Theme
                        </button>
                        <button type="button" onClick={resetDefaults} className="rounded-full border border-white/10 px-6 py-3 text-muted">
                            Reset Preview
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
