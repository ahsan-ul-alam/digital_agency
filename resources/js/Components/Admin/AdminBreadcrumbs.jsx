import { Link, usePage } from '../../app';
import { RiArrowRightSLine } from 'react-icons/ri';

export default function AdminBreadcrumbs({ title }) {
    const { url } = usePage();
    const crumbs = [{ label: 'Dashboard', href: '/admin' }];

    if (url && url !== '/admin' && url !== '/admin/') {
        const segments = url.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
        let path = '/admin';

        segments.forEach((segment, index) => {
            path += `/${segment}`;
            const isLast = index === segments.length - 1;
            crumbs.push({
                label: isLast ? (title || segment.replace(/-/g, ' ')) : segment.replace(/-/g, ' '),
                href: isLast ? null : path,
            });
        });
    }

    return (
        <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="admin-breadcrumb-item">
                    {index > 0 && <RiArrowRightSLine className="admin-breadcrumb-sep" />}
                    {crumb.href ? (
                        <Link href={crumb.href} className="admin-breadcrumb-link">{crumb.label}</Link>
                    ) : (
                        <span className="admin-breadcrumb-current">{crumb.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
