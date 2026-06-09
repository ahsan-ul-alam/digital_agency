import { Link, usePage } from '../app';
import { RiDashboardLine, RiLayout4Line, RiPencilLine } from 'react-icons/ri';

export default function AdminEditBar() {
    const { auth, adminEdit } = usePage().props;

    if (!auth?.user || !adminEdit?.href) {
        return null;
    }

    const isBuilder = adminEdit.type === 'ar-builder';
    const EditIcon = isBuilder ? RiLayout4Line : RiPencilLine;

    return (
        <div className="admin-edit-bar">
            <div className="admin-edit-bar-inner site-container">
                <div className="admin-edit-bar-meta">
                    <span className="admin-edit-bar-badge">Admin</span>
                    <span className="admin-edit-bar-text">
                        {adminEdit.title || 'Live preview'}
                    </span>
                </div>
                <div className="admin-edit-bar-actions">
                    <Link href="/admin" className="admin-edit-bar-link">
                        <RiDashboardLine /> Dashboard
                    </Link>
                    <Link href={adminEdit.href} className={`admin-edit-bar-button ${isBuilder ? 'is-builder' : ''}`}>
                        <EditIcon /> {adminEdit.label}
                    </Link>
                </div>
            </div>
        </div>
    );
}
