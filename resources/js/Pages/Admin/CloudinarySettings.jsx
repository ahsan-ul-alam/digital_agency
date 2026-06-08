import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';

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

    return (
        <AdminLayout title="Cloudinary" subtitle="Connect your Cloudinary account for image and video management across the site.">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="glass rounded-3xl p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary">Media Pipeline</p>
                    <h2 className="mt-4 text-3xl font-black">Cloudinary Image & Video</h2>
                    <p className="mt-4 leading-7 text-muted">
                        Connect your Cloudinary account to manage images and videos from the dashboard. All uploads — hero media, service banners, team photos, portfolio images, blog thumbnails, logos and gallery assets — go to Cloudinary when configured.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                        <span className={`inline-flex h-3 w-3 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className="text-sm text-muted">{connected ? 'Credentials configured' : 'Using local storage fallback'}</span>
                    </div>
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted">
                        <p className="font-semibold text-white">Supported media</p>
                        <ul className="mt-2 grid gap-1 text-muted">
                            <li>+ Images (JPG, PNG, WebP, SVG, GIF)</li>
                            <li>+ Videos (MP4, WebM, MOV)</li>
                            <li>+ Auto format & quality optimization on frontend</li>
                            <li>+ Lazy loading for images</li>
                        </ul>
                    </div>
                </div>
                <form onSubmit={submit} className="glass grid gap-5 rounded-3xl p-6">
                    {[
                        ['cloud_name', 'Cloud Name', 'text'],
                        ['api_key', 'API Key', 'text'],
                        ['api_secret', 'API Secret', 'password'],
                        ['upload_preset', 'Upload Preset (optional)', 'text'],
                        ['folder', 'Folder Name', 'text'],
                    ].map(([field, label, type]) => (
                        <label key={field} className="grid gap-2">
                            <span className="text-sm font-semibold text-muted">{label}</span>
                            <Input
                                type={type}
                                value={form.data[field]}
                                onChange={(e) => form.setData(field, e.target.value)}
                            />
                            {form.errors[field] && <span className="text-sm text-rose-300">{form.errors[field]}</span>}
                        </label>
                    ))}
                    {testResult && (
                        <p className={`rounded-2xl p-4 text-sm ${testResult.ok ? 'bg-emerald-400/10 text-emerald-200' : 'bg-rose-400/10 text-rose-200'}`}>
                            {testResult.message}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">
                            Save Settings
                        </button>
                        <button
                            type="button"
                            disabled={testing}
                            onClick={testConnection}
                            className="rounded-full border border-white/10 px-6 py-3 text-slate-200 disabled:opacity-60"
                        >
                            {testing ? 'Testing...' : 'Test Connection'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
