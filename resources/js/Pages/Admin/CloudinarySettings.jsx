import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import ResourceEditorShell from '../../Components/Admin/ResourceEditorShell';
import { FieldShell } from '../../Components/Cms/fields';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';
import { RiCheckLine, RiCloudLine, RiImageLine } from 'react-icons/ri';

const tabs = [
    {
        id: 'content',
        title: 'Credentials',
        hint: 'API keys and folder',
        sections: [{ id: 'credentials', title: 'Cloudinary account', description: 'Connect your Cloudinary account for image and video management.' }],
    },
    {
        id: 'settings',
        title: 'Status',
        hint: 'Connection and media types',
        sections: [{ id: 'status', title: 'Media pipeline', description: 'Supported formats and connection health.' }],
    },
];

export default function CloudinarySettings({ settings, connected }) {
    const [testResult, setTestResult] = useState(null);
    const [testing, setTesting] = useState(false);
    const form = useForm({
        cloud_name: settings.cloud_name || '',
        api_key: settings.api_key || '',
        api_secret: settings.api_secret || '',
        upload_preset: settings.upload_preset || '',
        folder: settings.folder || 'arsoftbd',
    });

    function submit(e) {
        e.preventDefault();
        form.put('/admin/cloudinary/settings');
    }

    async function testConnection() {
        setTesting(true);
        setTestResult(null);
        try {
            const { data } = await window.axios.post('/admin/cloudinary/test');
            setTestResult(data);
        } catch {
            setTestResult({ ok: false, message: 'Connection test failed. Please try again.' });
        } finally {
            setTesting(false);
        }
    }

    const sidebarExtra = (
        <div className="cloudinary-status-card">
            <span className={`cloudinary-status-dot ${connected ? 'is-connected' : 'is-warning'}`} />
            <div>
                <strong>{connected ? 'Connected' : 'Not configured'}</strong>
                <p>{connected ? 'Uploads route to Cloudinary.' : 'Using local storage fallback.'}</p>
            </div>
        </div>
    );

    return (
        <AdminLayout title="Cloudinary" subtitle="Connect your Cloudinary account for image and video management across the site.">
            <ResourceEditorShell
                title="Cloudinary"
                subtitle={form.data.cloud_name || 'Media pipeline'}
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                statusLabel={connected ? 'Connected' : 'Fallback mode'}
                sidebarExtra={sidebarExtra}
            >
                {(section) => {
                    if (section.id === 'credentials') {
                        return (
                            <div className="cms-form-grid">
                                {[
                                    ['cloud_name', 'Cloud name', 'text'],
                                    ['api_key', 'API key', 'text'],
                                    ['api_secret', 'API secret', 'password'],
                                    ['upload_preset', 'Upload preset (optional)', 'text'],
                                    ['folder', 'Folder name', 'text'],
                                ].map(([field, label, type]) => (
                                    <FieldShell key={field} label={label} error={form.errors[field]} wide={field === 'api_secret'}>
                                        <Input
                                            type={type}
                                            value={form.data[field]}
                                            onChange={(e) => form.setData(field, e.target.value)}
                                        />
                                    </FieldShell>
                                ))}
                                {testResult && (
                                    <p className={`admin-test-result ${testResult.ok ? 'is-ok' : 'is-error'}`}>
                                        {testResult.ok ? <RiCheckLine /> : null} {testResult.message}
                                    </p>
                                )}
                                <button type="button" className="resource-editor-btn is-secondary" disabled={testing} onClick={testConnection}>
                                    <RiCloudLine /> {testing ? 'Testing…' : 'Test connection'}
                                </button>
                            </div>
                        );
                    }

                    return (
                        <div className="cloudinary-info-grid">
                            <div className="cloudinary-info-card">
                                <RiImageLine />
                                <div>
                                    <strong>Supported media</strong>
                                    <ul>
                                        <li>Images — JPG, PNG, WebP, SVG, GIF</li>
                                        <li>Videos — MP4, WebM, MOV</li>
                                        <li>Auto format & quality on frontend</li>
                                        <li>Lazy loading for images</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="cms-field-hint">All uploads — hero media, service banners, portfolio, blog thumbnails and logos — go to Cloudinary when configured.</p>
                        </div>
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
