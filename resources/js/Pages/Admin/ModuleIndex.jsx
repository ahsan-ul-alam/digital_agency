import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from '../../Components/Admin/DataTable';
import { Link, router } from '../../app';
import { NavIcon } from '../../Admin/icons';
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

const emptyCopy = {
    services: {
        title: 'No services yet',
        body: 'Create your first service to showcase what your agency offers on the homepage and service pages.',
        cta: 'Create first service',
    },
    portfolio: {
        title: 'No portfolio projects yet',
        body: 'Add case studies to build trust and demonstrate your work quality.',
        cta: 'Add first project',
    },
    packages: {
        title: 'No pricing packages yet',
        body: 'Publish clear pricing tiers so prospects can compare and convert faster.',
        cta: 'Create first package',
    },
    blog: {
        title: 'No blog posts yet',
        body: 'Publish thought leadership content to improve SEO and nurture leads.',
        cta: 'Write first post',
    },
    pages: {
        title: 'No pages yet',
        body: 'Launch landing pages with AR Builder for a polished, conversion-focused site.',
        cta: 'Create first page',
    },
    leads: {
        title: 'No leads yet',
        body: 'Hero forms, quote requests and contact pages will populate your CRM inbox.',
        cta: null,
    },
    media: {
        title: 'No media files yet',
        body: 'Upload images to Cloudinary and reuse them across pages, services and blog posts.',
        cta: 'Upload first file',
    },
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

function bulkDelete(module, ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'item' : 'items'}? This cannot be undone.`)) {
        return;
    }

    router.delete(`/admin/${module}/bulk`, {
        data: { ids },
        preserveScroll: true,
        onSuccess: onDone,
    });
}

function ModuleEmptyState({ module, config, canCreate, createHref }) {
    const copy = emptyCopy[module] || {
        title: `No ${config.title.toLowerCase()} yet`,
        body: config.description,
        cta: 'Create first item',
    };

    return (
        <div className="admin-empty-state admin-empty-state-large admin-empty-state-premium">
            <span className="admin-empty-state-icon"><NavIcon name={module} /></span>
            <h3>{copy.title}</h3>
            <p>{copy.body}</p>
            {canCreate && copy.cta !== null && (
                <Link href={createHref} className="admin-topbar-primary">
                    <RiAddLine /> {copy.cta}
                </Link>
            )}
        </div>
    );
}

export default function ModuleIndex({ module, config, items }) {
    const columns = config.list_columns || config.columns.slice(0, 5);
    const canCreate = config.creatable !== false;
    const createHref = module === 'pages' ? '/admin/pages/create' : `/admin/${module}/create`;
    const singular = config.title.replace(/s$/, '');

    const headerAction = canCreate ? (
        <Link href={createHref} className="admin-topbar-primary">
            <RiAddLine /> {module === 'pages' ? 'Create Page' : `Add ${singular}`}
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
                tableId={module}
                columns={columns}
                rows={items.data}
                columnLabels={columnLabels}
                exportFileName={module}
                onBulkDelete={(ids, onDone) => bulkDelete(module, ids, onDone)}
                quickEditHref={(row) => `/admin/${module}/${row.id}/edit`}
                renderCell={(row, column) => display(row[column], column)}
                emptyState={(
                    <ModuleEmptyState
                        module={module}
                        config={config}
                        canCreate={canCreate}
                        createHref={createHref}
                    />
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
                        <button
                            type="button"
                            onClick={() => window.confirm('Delete this item?') && router.delete(`/admin/${module}/${item.id}`)}
                            className="admin-row-action is-danger"
                        >
                            Delete
                        </button>
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
