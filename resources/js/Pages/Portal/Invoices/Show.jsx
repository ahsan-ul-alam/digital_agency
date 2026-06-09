import PortalLayout from '../../../Layouts/PortalLayout';
import { RiBankLine, RiDownloadLine, RiSecurePaymentLine, RiWallet3Line } from 'react-icons/ri';

function money(amount) {
    return `BDT ${Number(amount || 0).toLocaleString()}`;
}

function hasPaymentDetails(instructions) {
    return Boolean(
        instructions?.bank_name
        || instructions?.account_number
        || instructions?.routing_or_mobile
        || instructions?.instructions
    );
}

function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
}

export default function InvoiceShow({ invoice, paymentSummary, paymentInstructions, paymentGateways = {} }) {
    const balanceDue = paymentSummary?.balance_due ?? 0;
    const paidTotal = paymentSummary?.paid_total ?? 0;
    const showManualPanel = balanceDue > 0 && hasPaymentDetails(paymentInstructions);
    const showOnlinePanel = balanceDue > 0 && (paymentGateways.bkash || paymentGateways.eps);
    const isPaid = balanceDue <= 0;

    return (
        <PortalLayout
            title={invoice.invoice_number}
            subtitle="Invoice details and payment"
            actions={(
                <a href={`/portal/invoices/${invoice.id}/pdf`} className="portal-btn" target="_blank" rel="noreferrer">
                    <RiDownloadLine /> Download PDF
                </a>
            )}
        >
            <section className={`portal-invoice-hero ${isPaid ? 'is-paid' : 'is-due'}`}>
                <div className="portal-invoice-hero-copy">
                    <p className="portal-eyebrow">Invoice summary</p>
                    <h2>{money(invoice.total)}</h2>
                    <p>
                        {isPaid
                            ? 'This invoice is fully paid. Thank you!'
                            : `${money(balanceDue)} outstanding · due ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'on receipt'}`}
                    </p>
                </div>
                <div className="portal-invoice-hero-stats">
                    <div><span>Status</span><strong><span className={`portal-badge is-${invoice.status}`}>{invoice.status}</span></strong></div>
                    <div><span>Paid</span><strong>{money(paidTotal)}</strong></div>
                    <div><span>Balance</span><strong>{money(balanceDue)}</strong></div>
                </div>
            </section>

            {showOnlinePanel && (
                <section className="portal-payment-card">
                    <header>
                        <RiSecurePaymentLine />
                        <div>
                            <h2>Pay online</h2>
                            <p>Secure checkout — you will be redirected to your chosen payment provider.</p>
                        </div>
                    </header>
                    <div className="portal-pay-actions">
                        {paymentGateways.bkash && (
                            <form method="POST" action={`/portal/invoices/${invoice.id}/pay/bkash`}>
                                <input type="hidden" name="_token" value={csrfToken()} />
                                <button type="submit" className="portal-pay-btn is-bkash">
                                    <RiWallet3Line /> Pay {money(balanceDue)} with bKash
                                </button>
                            </form>
                        )}
                        {paymentGateways.eps && (
                            <form method="POST" action={`/portal/invoices/${invoice.id}/pay/eps`}>
                                <input type="hidden" name="_token" value={csrfToken()} />
                                <button type="submit" className="portal-pay-btn is-eps">
                                    <RiSecurePaymentLine /> Pay {money(balanceDue)} with EPS
                                </button>
                            </form>
                        )}
                    </div>
                    {paymentInstructions.bkash_display_number && (
                        <p className="portal-payment-note">Manual bKash fallback: {paymentInstructions.bkash_display_number}</p>
                    )}
                </section>
            )}

            <div className="portal-detail-grid">
                <section className="portal-panel">
                    <h2>Details</h2>
                    <dl className="portal-dl">
                        <div><dt>Due date</dt><dd>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</dd></div>
                        {invoice.proposal && <div><dt>Proposal</dt><dd>{invoice.proposal.number}</dd></div>}
                        <div><dt>Subtotal</dt><dd>{money(invoice.subtotal)}</dd></div>
                        <div><dt>Tax ({invoice.tax_percent}%)</dt><dd>{money(invoice.tax_amount)}</dd></div>
                        <div className="is-total"><dt>Total</dt><dd>{money(invoice.total)}</dd></div>
                    </dl>
                </section>

                <section className="portal-panel">
                    <h2>Line items</h2>
                    <div className="portal-line-items">
                        {(invoice.line_items || []).map((item, i) => (
                            <div key={i} className="portal-line-item">
                                <span>{item.description}</span>
                                <span>{item.quantity} × {money(item.unit_price)}</span>
                                <strong>{money((item.quantity || 0) * (item.unit_price || 0))}</strong>
                            </div>
                        ))}
                    </div>
                </section>

                {showManualPanel && (
                    <section className="portal-panel portal-panel-wide portal-bank-card">
                        <header className="portal-bank-head">
                            <RiBankLine />
                            <div>
                                <h2>Bank transfer</h2>
                                <p>Pay via bank transfer and email proof of payment.</p>
                            </div>
                        </header>
                        <dl className="portal-dl portal-dl-grid">
                            {paymentInstructions.bank_name && <div><dt>Bank</dt><dd>{paymentInstructions.bank_name}</dd></div>}
                            {paymentInstructions.account_name && <div><dt>Account name</dt><dd>{paymentInstructions.account_name}</dd></div>}
                            {paymentInstructions.account_number && <div><dt>Account number</dt><dd>{paymentInstructions.account_number}</dd></div>}
                            {paymentInstructions.routing_or_mobile && <div><dt>Routing / mobile</dt><dd>{paymentInstructions.routing_or_mobile}</dd></div>}
                        </dl>
                        {paymentInstructions.instructions && (
                            <div className="portal-payment-instructions rich-text-content" dangerouslySetInnerHTML={{ __html: paymentInstructions.instructions }} />
                        )}
                        {paymentInstructions.support_email && (
                            <p className="portal-payment-note">
                                Questions? Email <a href={`mailto:${paymentInstructions.support_email}`}>{paymentInstructions.support_email}</a>
                            </p>
                        )}
                    </section>
                )}
            </div>
        </PortalLayout>
    );
}
