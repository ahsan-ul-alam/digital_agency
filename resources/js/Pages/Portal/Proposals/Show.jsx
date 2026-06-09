import PortalLayout from '../../../Layouts/PortalLayout';
import { router } from '../../../app';
import { RiCheckLine, RiCloseLine, RiDownloadLine, RiFileList3Line } from 'react-icons/ri';

function money(amount) {
    return `BDT ${Number(amount || 0).toLocaleString()}`;
}

export default function ProposalShow({ proposal }) {
    function respond(status) {
        if (!window.confirm(`Mark this proposal as ${status}?`)) return;
        router.post(`/portal/proposals/${proposal.id}/respond`, { status });
    }

    const canRespond = proposal.status === 'sent';

    return (
        <PortalLayout
            title={proposal.number}
            subtitle={proposal.title}
            actions={(
                <a href={`/portal/proposals/${proposal.id}/pdf`} className="portal-btn" target="_blank" rel="noreferrer">
                    <RiDownloadLine /> Download PDF
                </a>
            )}
        >
            <section className={`portal-invoice-hero ${proposal.status === 'accepted' ? 'is-paid' : canRespond ? 'is-due' : ''}`}>
                <div className="portal-invoice-hero-copy">
                    <p className="portal-eyebrow"><RiFileList3Line /> Proposal</p>
                    <h2>{money(proposal.total)}</h2>
                    <p>
                        {proposal.timeline ? `Delivery: ${proposal.timeline}` : 'Review scope and pricing below.'}
                        {proposal.valid_until && ` · Valid until ${new Date(proposal.valid_until).toLocaleDateString()}`}
                    </p>
                </div>
                <div className="portal-invoice-hero-stats">
                    <div><span>Status</span><strong><span className={`portal-badge is-${proposal.status}`}>{proposal.status}</span></strong></div>
                    <div><span>Subtotal</span><strong>{money(proposal.subtotal)}</strong></div>
                    <div><span>Tax</span><strong>{money(proposal.tax_amount)}</strong></div>
                </div>
            </section>

            {canRespond && (
                <section className="portal-payment-card portal-response-card">
                    <header>
                        <RiCheckLine />
                        <div>
                            <h2>Your decision</h2>
                            <p>Accept to move forward, or decline if this scope does not fit.</p>
                        </div>
                    </header>
                    <div className="portal-pay-actions">
                        <button type="button" className="portal-pay-btn is-eps" onClick={() => respond('accepted')}>
                            <RiCheckLine /> Accept proposal
                        </button>
                        <button type="button" className="portal-btn" onClick={() => respond('declined')}>
                            <RiCloseLine /> Decline
                        </button>
                    </div>
                </section>
            )}

            <div className="portal-detail-grid">
                <section className="portal-panel">
                    <h2>Details</h2>
                    <dl className="portal-dl">
                        <div><dt>Proposal #</dt><dd>{proposal.number}</dd></div>
                        <div><dt>Title</dt><dd>{proposal.title}</dd></div>
                        <div><dt>Timeline</dt><dd>{proposal.timeline || '—'}</dd></div>
                        <div><dt>Valid until</dt><dd>{proposal.valid_until ? new Date(proposal.valid_until).toLocaleDateString() : '—'}</dd></div>
                    </dl>
                </section>

                <section className="portal-panel">
                    <h2>Line items</h2>
                    <div className="portal-line-items">
                        {(proposal.line_items || []).map((item, i) => (
                            <div key={i} className="portal-line-item">
                                <span>{item.description}</span>
                                <span>{item.quantity} × {money(item.unit_price)}</span>
                                <strong>{money((item.quantity || 0) * (item.unit_price || 0))}</strong>
                            </div>
                        ))}
                    </div>
                    <div className="portal-line-summary">
                        <div><span>Subtotal</span><strong>{money(proposal.subtotal)}</strong></div>
                        <div><span>Tax ({proposal.tax_percent}%)</span><strong>{money(proposal.tax_amount)}</strong></div>
                        <div className="is-total"><span>Total</span><strong>{money(proposal.total)}</strong></div>
                    </div>
                </section>

                {proposal.notes && (
                    <section className="portal-panel portal-panel-wide">
                        <h2>Notes</h2>
                        <div className="portal-notes rich-text-content" dangerouslySetInnerHTML={{ __html: proposal.notes }} />
                    </section>
                )}
            </div>
        </PortalLayout>
    );
}
