import AdminLayout from '../../../Layouts/AdminLayout';
import DataTable from '../../../Components/Admin/DataTable';
import EmptyState from '../../../Components/Admin/EmptyState';
import { Link, router } from '../../../app';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiKey2Line } from 'react-icons/ri';

function regeneratePassword(user) {
    if (!window.confirm(`Generate a new password for ${user.email}? The current password will stop working immediately.`)) {
        return;
    }

    router.post(`/admin/users/${user.id}/regenerate-password`, {}, { preserveScroll: true });
}

function bulkDelete(ids, onDone) {
    if (!window.confirm(`Delete ${ids.length} selected ${ids.length === 1 ? 'user' : 'users'}?`)) {
        return;
    }

    router.delete('/admin/users/bulk', {
        data: { ids },
        preserveScroll: true,
        onSuccess: onDone,
    });
}

export default function UsersIndex({ users, authUserId }) {
    const rows = users.map((user) => ({
        ...user,
        role_name: user.account_type === 'client' ? 'Client portal' : (user.role?.name || 'No role'),
    }));

    const headerAction = (
        <Link href="/admin/users/create" className="admin-topbar-primary">
            <RiAddLine /> Add User
        </Link>
    );

    return (
        <AdminLayout title="Users" subtitle="Create admin accounts and assign roles to control access." actions={headerAction}>
            <DataTable
                tableId="users"
                quickEditHref={(row) => row.account_type !== 'client' ? `/admin/users/${row.id}/edit` : null}
                columns={['name', 'email', 'role_name', 'created_at']}
                rows={rows}
                columnLabels={{
                    name: 'Name',
                    email: 'Email',
                    role_name: 'Role',
                    created_at: 'Created',
                }}
                exportFileName="users"
                onBulkDelete={bulkDelete}
                canSelectRow={(row) => row.id !== authUserId}
                actions={(row) => (
                    <div className="admin-table-actions">
                        {row.account_type !== 'client' && (
                            <Link href={`/admin/users/${row.id}/edit`} className="admin-table-action"><RiEditLine /></Link>
                        )}
                        {row.id !== authUserId && (
                            <button type="button" className="admin-table-action" title="Regenerate password" onClick={() => regeneratePassword(row)}>
                                <RiKey2Line />
                            </button>
                        )}
                        <button type="button" className="admin-table-action is-danger" onClick={() => router.delete(`/admin/users/${row.id}`)}>
                            <RiDeleteBinLine />
                        </button>
                    </div>
                )}
                emptyState={(
                    <EmptyState
                        icon={RiAddLine}
                        title="No users yet"
                        body="Add team members and assign them a role."
                        ctaHref="/admin/users/create"
                        ctaLabel="Add first user"
                    />
                )}
            />
        </AdminLayout>
    );
}
