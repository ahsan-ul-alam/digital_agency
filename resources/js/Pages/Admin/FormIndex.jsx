import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/Admin/DataTable';
import EmptyState from '../../Components/Admin/EmptyState';
import { Link, router } from '../../app';
import { RiAddLine, RiFileList3Line } from 'react-icons/ri';

function bulkDelete(ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'form' : 'forms'}?`)) {
        return;
    }

    router.delete('/admin/forms/bulk', {
        data: { ids },
        preserveScroll: true,
        onSuccess: onDone,
    });
}

export default function FormIndex({ forms }) {
    const rows = forms.data.map((form) => ({
        ...form,
        fields_count: (form.fields || []).length,
        status: form.is_active ? 'Active' : 'Inactive',
    }));

    const headerAction = (
        <Link href="/admin/forms/create" className="admin-topbar-primary">
            <RiAddLine /> New Form
        </Link>
    );

    return (
        <AdminLayout title="Form Builder" subtitle="Create forms and embed them in pages using shortcodes." actions={headerAction}>
            <div className="admin-page-meta">
                <p>{forms.total} form{forms.total === 1 ? '' : 's'}</p>
            </div>

            <DataTable
                tableId="forms"
                quickEditHref={(row) => `/admin/forms/${row.id}/edit`}
                columns={['name', 'shortcode', 'fields_count', 'submissions_count', 'status']}
                rows={rows}
                columnLabels={{
                    name: 'Name',
                    shortcode: 'Shortcode',
                    fields_count: 'Fields',
                    submissions_count: 'Submissions',
                    status: 'Status',
                }}
                exportFileName="forms"
                onBulkDelete={bulkDelete}
                actions={(form) => (
                    <div className="admin-row-actions">
                        <Link href={`/admin/forms/${form.id}/edit`} className="admin-row-action">Edit</Link>
                        <Link href={`/admin/forms/${form.id}/submissions`} className="admin-row-action">Responses</Link>
                        <button
                            type="button"
                            className="admin-row-action is-danger"
                            onClick={() => window.confirm('Delete this form?') && router.delete(`/admin/forms/${form.id}`)}
                        >
                            Delete
                        </button>
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiFileList3Line}
                        title="No forms yet"
                        body="Create a form and embed it in AR Builder pages."
                        ctaHref="/admin/forms/create"
                        ctaLabel="Create first form"
                    />
                )}
            />
        </AdminLayout>
    );
}
