import AdminLayout from '../../../Layouts/AdminLayout';
import { Link } from '../../../app';
import { RiCalculatorLine, RiExternalLinkLine } from 'react-icons/ri';

export default function QuotesIndex({ types }) {
    return (
        <AdminLayout
            title="Quote Calculator"
            subtitle="Configure project types and pricing options for the public quote calculator."
            actions={(
                <a href="/quote" target="_blank" rel="noreferrer" className="admin-topbar-btn">
                    <RiExternalLinkLine /> View public calculator
                </a>
            )}
        >
            <div className="admin-sales-grid">
                {types.map((type) => (
                    <article key={type.id} className="admin-sales-card">
                        <div className="admin-sales-card-icon"><RiCalculatorLine /></div>
                        <div className="admin-sales-card-copy">
                            <h3>{type.name}</h3>
                            <p>{type.description}</p>
                            <p className="admin-sales-card-meta">
                                Base: {type.currency} {Number(type.base_price).toLocaleString()} · {(type.options || []).length} options
                            </p>
                        </div>
                        <Link href={`/admin/quotes/${type.id}/edit`} className="admin-row-action is-primary">Configure</Link>
                    </article>
                ))}
            </div>
        </AdminLayout>
    );
}
