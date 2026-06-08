import { useRef } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import FormShell from '../../Components/Cms/FormShell';
import { FieldShell, SeoField, SocialField } from '../../Components/Cms/fields';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';

const shellSections = [
    { id: 'identity', title: 'Site Identity', description: 'Brand name, tagline, logo and favicon.' },
    { id: 'contact', title: 'Contact Details', description: 'Shown in the footer and contact page.' },
    { id: 'social', title: 'Social Profiles', description: 'Footer social icons and sharing links.' },
    { id: 'seo', title: 'SEO Defaults', description: 'Fallback meta tags for the public website.' },
];

export default function SiteSettings({ site, contact, social, seo }) {
    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);
    const form = useForm({
        site: { name: site.name || '', tagline: site.tagline || '', logo: site.logo || '', favicon: site.favicon || '' },
        contact: { ...contact },
        social: { ...social },
        seo: { ...seo },
        logo_file: null,
        favicon_file: null,
    });

    function setNested(prefix, field, value) {
        form.setData(prefix, { ...form.data[prefix], [field]: value });
    }

    function submit(e) {
        e.preventDefault();
        form.post('/admin/site/settings', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.setData('logo_file', null);
                form.setData('favicon_file', null);
            },
        });
    }

    const logoPreview = form.data.logo_file ? URL.createObjectURL(form.data.logo_file) : form.data.site.logo;
    const faviconPreview = form.data.favicon_file ? URL.createObjectURL(form.data.favicon_file) : form.data.site.favicon;

    return (
        <AdminLayout title="Company Information" subtitle="Manage brand identity, contact details, social links and SEO defaults.">
            <FormShell
                title="Site Settings"
                subtitle="Global settings used across the public website."
                sections={shellSections}
                onSubmit={submit}
                processing={form.processing}
            >
                {(section) => {
                    if (section.id === 'identity') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Site Name" error={form.errors['site.name']}>
                                    <Input required value={form.data.site.name} onChange={(e) => setNested('site', 'name', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Tagline">
                                    <Input value={form.data.site.tagline} onChange={(e) => setNested('site', 'tagline', e.target.value)} />
                                </FieldShell>
                                <div className="cms-form-grid is-wide-row">
                                    <FieldShell label="Site Logo" hint="Displayed in header and footer when enabled in Menus." wide>
                                        <div className="cms-media-field">
                                            <div className="cms-media-preview cms-media-preview-sm" onClick={() => logoInputRef.current?.click()}>
                                                {logoPreview ? <img src={logoPreview} alt="Logo" /> : <span className="cms-media-empty">Upload logo</span>}
                                            </div>
                                            <div className="cms-media-actions">
                                                <button type="button" className="cms-media-btn" onClick={() => logoInputRef.current?.click()}>Upload logo</button>
                                                {logoPreview && (
                                                    <button type="button" className="cms-media-btn is-muted" onClick={() => { form.setData('logo_file', null); setNested('site', 'logo', ''); }}>Remove</button>
                                                )}
                                            </div>
                                            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => form.setData('logo_file', e.target.files[0])} />
                                        </div>
                                    </FieldShell>
                                    <FieldShell label="Favicon" hint="Browser tab icon." wide>
                                        <div className="cms-media-field">
                                            <div className="cms-media-preview cms-media-preview-sm" onClick={() => faviconInputRef.current?.click()}>
                                                {faviconPreview ? <img src={faviconPreview} alt="Favicon" /> : <span className="cms-media-empty">Upload favicon</span>}
                                            </div>
                                            <div className="cms-media-actions">
                                                <button type="button" className="cms-media-btn" onClick={() => faviconInputRef.current?.click()}>Upload favicon</button>
                                                {faviconPreview && (
                                                    <button type="button" className="cms-media-btn is-muted" onClick={() => { form.setData('favicon_file', null); setNested('site', 'favicon', ''); }}>Remove</button>
                                                )}
                                            </div>
                                            <input ref={faviconInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon,.ico" className="hidden" onChange={(e) => form.setData('favicon_file', e.target.files[0])} />
                                        </div>
                                    </FieldShell>
                                </div>
                            </div>
                        );
                    }

                    if (section.id === 'contact') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Email"><Input type="email" value={form.data.contact.email || ''} onChange={(e) => setNested('contact', 'email', e.target.value)} /></FieldShell>
                                <FieldShell label="Phone"><Input value={form.data.contact.phone || ''} onChange={(e) => setNested('contact', 'phone', e.target.value)} /></FieldShell>
                                <FieldShell label="Address" wide><Input value={form.data.contact.address || ''} onChange={(e) => setNested('contact', 'address', e.target.value)} /></FieldShell>
                                <FieldShell label="Google Maps URL" wide><Input value={form.data.contact.map || ''} onChange={(e) => setNested('contact', 'map', e.target.value)} /></FieldShell>
                            </div>
                        );
                    }

                    if (section.id === 'social') {
                        return <SocialField value={form.data.social} onChange={(next) => form.setData('social', next)} />;
                    }

                    if (section.id === 'seo') {
                        return <SeoField value={form.data.seo} onChange={(next) => form.setData('seo', next)} />;
                    }

                    return null;
                }}
            </FormShell>
        </AdminLayout>
    );
}
