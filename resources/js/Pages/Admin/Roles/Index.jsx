import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/Admin/DataTable';
import EmptyState from '../../../Components/Admin/EmptyState';
import { Link, router } from '../../../app';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiShieldUserLine } from 'react-icons/ri';

function bulkDelete(ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'role' : 'roles'}?`)) {
        return;
    }

    router.delete('/admin/roles/bulk', {
        data: { ids },
        preserveScroll: true,
        onSuccess: onDone,
    });
}

export default function RolesIndex({ roles }) {
    const headerAction = (
        <Link href="/admin/roles/create" className="admin-topbar-primary">
            <RiAddLine /> Create Role
        </Link>
    );

    return (
        <AdminLayout title="Roles & Permissions" subtitle="Create roles and control which admin areas each role can access." actions={headerAction}>
            <DataTable
                tableId="roles"
                quickEditHref={(row) => `/admin/roles/${row.id}/edit`}
                columns={['name', 'slug', 'users_count', 'permissions_count', 'description']}
                rows={roles}
                columnLabels={{
                    name: 'Role',
                    slug: 'Slug',
                    users_count: 'Users',
                    permissions_count: 'Permissions',
                    description: 'Description',
                }}
                exportFileName="roles"
                onBulkDelete={bulkDelete}
                canSelectRow={(row) => !row.is_system}
                actions={(row) => (
                    <div className="admin-table-actions">
                        <Link href={`/admin/roles/${row.id}/edit`} className="admin-table-action"><RiEditLine /></Link>
                        {!row.is_system && (
                            <button type="button" className="admin-table-action is-danger" onClick={() => router.delete(`/admin/roles/${row.id}`)}>
                                <RiDeleteBinLine />
                            </button>
                        )}
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiShieldUserLine}
                        title="No roles yet"
                        body="Create a role and assign permissions to control admin access."
                        ctaHref="/admin/roles/create"
                        ctaLabel="Create first role"
                    />
                )}
            />
        </AdminLayout>
    );
}
