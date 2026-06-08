import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '../../app';
import { RiAddLine } from 'react-icons/ri';

export default function FormIndex({ forms }) {
    return (
        <AdminLayout title="Form Builder" subtitle="Create forms and embed them in pages using shortcodes.">
            <div className="mb-6 flex justify-between gap-3">
                <p className="text-sm text-muted">{forms.total} form{forms.total === 1 ? '' : 's'}</p>
                <Link href="/admin/forms/create" className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold">
                    <RiAddLine /> New Form
                </Link>
            </div>

            <div className="glass overflow-hidden rounded-3xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-muted">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Shortcode</th>
                            <th className="px-4 py-3">Fields</th>
                            <th className="px-4 py-3">Submissions</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.data.map((form) => (
                            <tr key={form.id} className="border-t border-white/10">
                                <td className="px-4 py-3 font-semibold">{form.name}</td>
                                <td className="px-4 py-3 text-primary">{form.shortcode}</td>
                                <td className="px-4 py-3 text-muted">{(form.fields || []).length}</td>
                                <td className="px-4 py-3 text-muted">{form.submissions_count}</td>
                                <td className="px-4 py-3">{form.is_active ? 'Active' : 'Inactive'}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-3">
                                        <Link href={`/admin/forms/${form.id}/edit`} className="text-primary">Edit</Link>
                                        <Link href={`/admin/forms/${form.id}/submissions`} className="text-primary">Responses</Link>
                                        <button onClick={() => confirm('Delete this form?') && router.delete(`/admin/forms/${form.id}`)} className="text-rose-300">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
