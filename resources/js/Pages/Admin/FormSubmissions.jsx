import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '../../app';

export default function FormSubmissions({ form, submissions }) {
    return (
        <AdminLayout title={`Responses · ${form.name}`} subtitle={`Shortcode: ${form.shortcode}`}>
            <div className="mb-4">
                <Link href="/admin/forms" className="text-sm text-primary">← Back to forms</Link>
            </div>

            <div className="glass overflow-hidden rounded-3xl">
                {submissions.data.length === 0 ? (
                    <p className="p-8 text-muted">No submissions yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-muted">
                                <tr>
                                    <th className="px-4 py-3">Submitted</th>
                                    <th className="px-4 py-3">Data</th>
                                    <th className="px-4 py-3">Page</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.data.map((submission) => (
                                    <tr key={submission.id} className="border-t border-white/10 align-top">
                                        <td className="px-4 py-3 text-muted">{new Date(submission.created_at).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="grid gap-1">
                                                {Object.entries(submission.data || {}).map(([key, value]) => (
                                                    <p key={key}><span className="text-muted">{key}:</span> {value}</p>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted">{submission.page_url || '—'}</td>
                                        <td className="px-4 py-3">
                                            {submission.read_at ? 'Read' : (
                                                <button onClick={() => router.post(`/admin/form-submissions/${submission.id}/read`)} className="text-primary">Mark read</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
