import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/Admin/DataTable';
import { Link, router } from '../../app';
import { RiAddLine, RiArrowLeftLine, RiArrowRightLine, RiLayoutMasonryLine } from 'react-icons/ri';

const columnLabels = {
    section_key: 'Section',
    title: 'Title',
    name: 'Name',
    slug: 'Slug',
    project_name: 'Project',
    client_name: 'Client',
    question: 'Question',
    label: 'Label',
    value: 'Value',
    suffix: 'Suffix',
    price: 'Price',
    duration: 'Duration',
    category: 'Category',
    status: 'Status',
    published_at: 'Published',
    is_active: 'Active',
    is_featured: 'Featured',
    is_highlighted: 'Highlighted',
    is_published: 'Published',
    sort_order: 'Order',
    email: 'Email',
    service: 'Service',
    read_at: 'Read',
    disk: 'Storage',
    mime_type: 'Type',
    size: 'Size',
    rating: 'Rating',
    company: 'Company',
    position: 'Position',
    url: 'URL',
};

function display(value, column) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (column === 'read_at') return value ? 'Read' : 'Unread';
    if (column === 'size' && typeof value === 'number') return `${Math.round(value / 1024)} KB`;
    if (Array.isArray(value)) return value.join(', ');
    if (value && typeof value === 'object') return '…';
    if (column === 'published_at' && value) return new Date(value).toLocaleDateString();
    return value ?? '—';
}

export default function ModuleIndex({ module, config, items }) {
    const columns = config.list_columns || config.columns.slice(0, 5);
    const canCreate = config.creatable !== false;
    const createHref = module === 'pages' ? '/admin/pages/create' : `/admin/${module}/create`;

    const headerAction = canCreate ? (
        <Link href={createHref} className="admin-topbar-primary">
            <RiAddLine /> {module === 'pages' ? 'Create Page' : 'Add New'}
        </Link>
    ) : null;

    return (
        <AdminLayout title={config.title} subtitle={config.description} actions={headerAction}>
            <div className="admin-page-meta">
                <p>
                    {items.total} {items.total === 1 ? 'record' : 'records'}
                    {items.last_page > 1 && ` · Page ${items.current_page} of ${items.last_page}`}
                </p>
            </div>

            <DataTable
                columns={columns}
                rows={items.data}
                columnLabels={columnLabels}
                exportFileName={module}
                renderCell={(row, column) => display(row[column], column)}
                emptyState={(
                    <div className="admin-empty-state admin-empty-state-large">
                        <h3>No records yet</h3>
                        <p>{config.description}</p>
                        {canCreate && (
                            <Link href={createHref} className="admin-topbar-primary">
                                Create first item
                            </Link>
                        )}
                    </div>
                )}
                actions={(item) => (
                    <div className="admin-row-actions">
                        {module === 'pages' && (
                            <Link href={`/admin/pages/${item.id}/builder`} className="admin-row-action is-primary">
                                <RiLayoutMasonryLine /> AR Builder
                            </Link>
                        )}
                        <Link href={`/admin/${module}/${item.id}/edit`} className="admin-row-action">
                            {module === 'contacts' ? 'View' : module === 'pages' ? 'Settings' : 'Edit'}
                        </Link>
                        {module !== 'contacts' && (
                            <button
                                type="button"
                                onClick={() => confirm('Delete this item?') && router.delete(`/admin/${module}/${item.id}`)}
                                className="admin-row-action is-danger"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            />

            {items.last_page > 1 && (
                <div className="admin-pagination">
                    <p>Showing {items.from}–{items.to} of {items.total}</p>
                    <div className="admin-pagination-actions">
                        {items.prev_page_url && (
                            <Link href={items.prev_page_url} className="admin-pagination-btn">
                                <RiArrowLeftLine /> Previous
                            </Link>
                        )}
                        {items.next_page_url && (
                            <Link href={items.next_page_url} className="admin-pagination-btn">
                                Next <RiArrowRightLine />
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
