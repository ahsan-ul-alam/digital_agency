import { Link } from '../../app';
import { RiAddLine } from 'react-icons/ri';

export default function EmptyState({ icon: Icon, title, body, ctaHref, ctaLabel }) {
    return (
        <div className="admin-empty-state admin-empty-state-large admin-empty-state-premium">
            {Icon && <span className="admin-empty-state-icon"><Icon /></span>}
            <h3>{title}</h3>
            <p>{body}</p>
            {ctaHref && ctaLabel && (
                <Link href={ctaHref} className="admin-topbar-primary">
                    <RiAddLine /> {ctaLabel}
                </Link>
            )}
        </div>
    );
}
