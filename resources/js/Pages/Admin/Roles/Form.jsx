import AdminLayout from '../../../Layouts/AdminLayout';
import ResourceEditorShell from '../../../Components/Admin/ResourceEditorShell';
import RichTextEditor from '../../../Components/Cms/RichTextEditor';
import { FieldShell } from '../../../Components/Cms/fields';
import { Input } from '../../../Components/Form';
import { useForm } from '../../../app';

const tabs = [
    {
        id: 'content',
        title: 'Details',
        hint: 'Name and description',
        sections: [{ id: 'details', title: 'Role details', description: 'How this role appears in the admin user manager.' }],
    },
    {
        id: 'settings',
        title: 'Permissions',
        hint: 'Module access control',
        sections: [{ id: 'permissions', title: 'Permission matrix', description: 'Select which areas this role can access.' }],
    },
];

export default function RoleForm({ role, permissionGroups }) {
    const isEdit = Boolean(role?.id);
    const selected = new Set((role?.permissions || []).map((permission) => permission.id));

    const form = useForm({
        name: role?.name || '',
        slug: role?.slug || '',
        description: role?.description || '',
        permission_ids: [...selected],
    });

    function togglePermission(id) {
        const next = new Set(form.data.permission_ids);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        form.setData('permission_ids', [...next]);
    }

    function toggleGroup(ids, checked) {
        const next = new Set(form.data.permission_ids);
        ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
        form.setData('permission_ids', [...next]);
    }

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            form.put(`/admin/roles/${role.id}`);
            return;
        }
        form.post('/admin/roles');
    }

    const isLocked = role?.slug === 'super-admin';

    return (
        <AdminLayout
            title={isEdit ? `Edit ${role.name}` : 'Create Role'}
            subtitle="Assign granular permissions for each admin module."
        >
            <ResourceEditorShell
                title="Roles"
                subtitle={form.data.name || 'New role'}
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/roles"
                statusLabel={`${form.data.permission_ids.length} permissions`}
            >
                {(section) => {
                    if (section.id === 'details') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Role name" error={form.errors.name}>
                                    <Input required value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Slug" hint="Auto-generated from name if left blank." error={form.errors.slug}>
                                    <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} disabled={role?.is_system} />
                                </FieldShell>
                                <FieldShell label="Description" wide error={form.errors.description}>
                                    <RichTextEditor compact value={form.data.description} onChange={(next) => form.setData('description', next)} minHeight="6rem" />
                                </FieldShell>
                            </div>
                        );
                    }

                    return (
                        <div className="admin-permission-matrix">
                            {isLocked && (
                                <p className="admin-form-note">Super Admin always has full access to every permission.</p>
                            )}

                            {permissionGroups.map((group) => {
                                const ids = group.permissions.map((permission) => permission.id);
                                const allChecked = ids.every((id) => form.data.permission_ids.includes(id));

                                return (
                                    <div key={group.group} className="admin-permission-group">
                                        <label className="admin-permission-group-head">
                                            <input
                                                type="checkbox"
                                                checked={allChecked}
                                                disabled={isLocked}
                                                onChange={(e) => toggleGroup(ids, e.target.checked)}
                                            />
                                            <span>{group.group}</span>
                                        </label>
                                        <div className="admin-permission-list">
                                            {group.permissions.map((permission) => (
                                                <label key={permission.id} className="admin-permission-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.data.permission_ids.includes(permission.id)}
                                                        disabled={isLocked}
                                                        onChange={() => togglePermission(permission.id)}
                                                    />
                                                    <span>
                                                        <strong>{permission.name}</strong>
                                                        <small>{permission.description}</small>
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
