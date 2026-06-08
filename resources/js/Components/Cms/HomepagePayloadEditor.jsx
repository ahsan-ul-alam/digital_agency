import { ListField, RepeaterField, FieldShell } from './fields';
import { Input } from '../Form';

export default function HomepagePayloadEditor({ sectionKey, value = {}, onChange }) {
    const payload = value || {};

    function set(key, val) {
        onChange({ ...payload, [key]: val });
    }

    if (sectionKey === 'hero') {
        return (
            <div className="cms-payload-grid">
                <FieldShell label="Highlighted Phrase" hint="Accent text inside the hero headline.">
                    <Input value={payload.highlight || ''} onChange={(e) => set('highlight', e.target.value)} />
                </FieldShell>
                <FieldShell label="Primary Button Label">
                    <Input value={payload.primary_cta || ''} onChange={(e) => set('primary_cta', e.target.value)} />
                </FieldShell>
                <FieldShell label="Primary Button URL">
                    <Input value={payload.primary_url || ''} onChange={(e) => set('primary_url', e.target.value)} />
                </FieldShell>
                <FieldShell label="Secondary Button Label">
                    <Input value={payload.secondary_cta || ''} onChange={(e) => set('secondary_cta', e.target.value)} />
                </FieldShell>
                <FieldShell label="Secondary Button URL">
                    <Input value={payload.secondary_url || ''} onChange={(e) => set('secondary_url', e.target.value)} />
                </FieldShell>
                <FieldShell label="Hero Form Title">
                    <Input value={payload.form_title || ''} onChange={(e) => set('form_title', e.target.value)} />
                </FieldShell>
                <FieldShell label="Hero Form Subtitle" wide>
                    <Input value={payload.form_subtitle || ''} onChange={(e) => set('form_subtitle', e.target.value)} />
                </FieldShell>
            </div>
        );
    }

    if (sectionKey === 'about') {
        return (
            <div className="cms-payload-stack">
                <ListField
                    label="Feature Bullets"
                    items={payload.features || []}
                    onChange={(items) => set('features', items.filter(Boolean))}
                    placeholder="Experienced team"
                />
                <RepeaterField
                    label="Mission / Vision Cards"
                    items={payload.cards || []}
                    onChange={(items) => set('cards', items)}
                    fields={[
                        { key: 'title', label: 'Card Title' },
                        { key: 'body', label: 'Card Body', type: 'richtext', wide: true },
                    ]}
                />
                <ListField
                    label="Why Choose Us Points"
                    items={payload.why_points || []}
                    onChange={(items) => set('why_points', items.filter(Boolean))}
                />
            </div>
        );
    }

    if (sectionKey === 'process') {
        return (
            <RepeaterField
                label="Process Steps"
                hint="Each step appears in the homepage process rail."
                items={payload.steps || []}
                onChange={(items) => set('steps', items)}
                fields={[
                    { key: 'title', label: 'Step Title' },
                    { key: 'body', label: 'Description', type: 'richtext', wide: true },
                    { key: 'icon', label: 'Icon Name', placeholder: 'RiSearchLine' },
                ]}
            />
        );
    }

    if (sectionKey === 'why') {
        return (
            <ListField
                label="Why Choose Points"
                items={payload.features || []}
                onChange={(items) => set('features', items.filter(Boolean))}
            />
        );
    }

    if (sectionKey === 'contact_cta') {
        return (
            <div className="cms-payload-grid">
                <FieldShell label="Button Label">
                    <Input value={payload.button || ''} onChange={(e) => set('button', e.target.value)} />
                </FieldShell>
                <FieldShell label="Button URL">
                    <Input value={payload.url || ''} onChange={(e) => set('url', e.target.value)} />
                </FieldShell>
            </div>
        );
    }

    return (
        <p className="cms-field-hint">No advanced settings for this section type.</p>
    );
}
