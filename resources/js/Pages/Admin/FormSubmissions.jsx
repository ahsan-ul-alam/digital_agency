import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/Admin/DataTable';
import EmptyState from '../../Components/Admin/EmptyState';
import { Link, router } from '../../app';
import { RiInboxLine } from 'react-icons/ri';

function submissionSummary(data = {}) {
    return Object.entries(data)
        .slice(0, 3)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' · ');
}

function bulkDelete(ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'response' : 'responses'}?`)) {
        return;
    }

    router.delete('/admin/form-submissions/bulk', {
        data: { ids },
        preserveScroll: true,
        onSuccess: onDone,
    });
}

export default function FormSubmissions({ form, submissions }) {
    const rows = submissions.data.map((submission) => ({
        ...submission,
        summary: submissionSummary(submission.data),
        status: submission.read_at ? 'Read' : 'Unread',
    }));

    return (
        <AdminLayout title={`Responses · ${form.name}`} subtitle={`Shortcode: ${form.shortcode}`}>
            <div className="mb-4">
                <Link href="/admin/forms" className="text-sm text-primary">← Back to forms</Link>
            </div>

            <DataTable
                tableId={`form-${form.id}-submissions`}
                columns={['created_at', 'summary', 'page_url', 'status']}
                rows={rows}
                columnLabels={{
                    created_at: 'Submitted',
                    summary: 'Response Data',
                    page_url: 'Page',
                    status: 'Status',
                }}
                exportFileName={`form-${form.shortcode}-responses`}
                onBulkDelete={bulkDelete}
                renderCell={(row, column) => {
                    if (column === 'created_at') return new Date(row.created_at).toLocaleString();
                    if (column === 'summary') {
                        return (
                            <div className="grid gap-1">
                                {Object.entries(row.data || {}).map(([key, value]) => (
                                    <p key={key}><span className="text-muted">{key}:</span> {value}</p>
                                ))}
                            </div>
                        );
                    }
                    if (column === 'status' && row.status === 'Unread') {
                        return (
                            <button
                                type="button"
                                onClick={() => router.post(`/admin/form-submissions/${row.id}/read`)}
                                className="text-primary"
                            >
                                Mark read
                            </button>
                        );
                    }
                    return row[column] ?? '—';
                }}
                actions={(row) => (
                    <button
                        type="button"
                        className="admin-row-action is-danger"
                        onClick={() => window.confirm('Delete this response?') && router.delete('/admin/form-submissions/bulk', { data: { ids: [row.id] } })}
                    >
                        Delete
                    </button>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiInboxLine}
                        title="No submissions yet"
                        body="Responses from this form will appear here when visitors submit it."
                    />
                )}
            />
        </AdminLayout>
    );
}
