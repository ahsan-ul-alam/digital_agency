import AdminLayout from '../../../Layouts/AdminLayout';
import ResourceEditorShell from '../../../Components/Admin/ResourceEditorShell';
import { FieldShell } from '../../../Components/Cms/fields';
import { Input, Select } from '../../../Components/Form';
import { router, useForm } from '../../../app';
import { RiKey2Line } from 'react-icons/ri';

const tabs = [
    {
        id: 'content',
        title: 'Account',
        hint: 'Name, email and role',
        sections: [{ id: 'account', title: 'Account details', description: 'Basic profile for this admin user.' }],
    },
    {
        id: 'settings',
        title: 'Security',
        hint: 'Password and access',
        sections: [{ id: 'security', title: 'Credentials', description: 'Set or rotate login credentials.' }],
    },
];

export default function UserForm({ user, roles, authUserId }) {
    const isEdit = Boolean(user?.id);
    const isSelf = isEdit && user.id === authUserId;

    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role_id: user?.role_id || user?.role?.id || roles[0]?.id || '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            form.put(`/admin/users/${user.id}`);
            return;
        }
        form.post('/admin/users');
    }

    const roleName = roles.find((r) => String(r.id) === String(form.data.role_id))?.name || 'No role';

    const headerActions = isEdit && !isSelf ? (
        <button
            type="button"
            className="resource-editor-btn is-ghost"
            onClick={() => window.confirm(`Generate a new password for ${user.email}?`) && router.post(`/admin/users/${user.id}/regenerate-password`)}
        >
            <RiKey2Line /> Regenerate password
        </button>
    ) : null;

    return (
        <AdminLayout
            title={isEdit ? `Edit ${user.name}` : 'Add User'}
            subtitle="Create an admin account and assign a role."
        >
            <ResourceEditorShell
                title="Users"
                subtitle={form.data.name || 'New user'}
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/users"
                statusLabel={roleName}
                saveLabel={isEdit ? 'Save user' : 'Create user'}
                headerActions={headerActions}
            >
                {(section) => {
                    if (section.id === 'account') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Full name" error={form.errors.name}>
                                    <Input required value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Email" error={form.errors.email}>
                                    <Input type="email" required value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Role" error={form.errors.role_id}>
                                    <Select value={form.data.role_id} onChange={(e) => form.setData('role_id', e.target.value)} required>
                                        <option value="">Select role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </Select>
                                </FieldShell>
                            </div>
                        );
                    }

                    return (
                        <div className="cms-form-grid">
                            <FieldShell
                                label={isEdit ? 'New password' : 'Password'}
                                hint={isEdit ? 'Leave blank to keep the current password.' : 'Minimum 8 characters.'}
                                error={form.errors.password}
                            >
                                <Input type="password" required={!isEdit} value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
                            </FieldShell>
                            <FieldShell label="Confirm password" error={form.errors.password_confirmation}>
                                <Input type="password" required={!isEdit && Boolean(form.data.password)} value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} />
                            </FieldShell>
                        </div>
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
