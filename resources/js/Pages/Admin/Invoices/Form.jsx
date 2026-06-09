import AdminLayout from '../../../Layouts/AdminLayout';
import LineItemsEditor from '../../../Components/Admin/LineItemsEditor';
import SalesEditorShell from '../../../Components/Admin/SalesEditorShell';
import RichTextEditor from '../../../Components/Cms/RichTextEditor';
import { FieldShell } from '../../../Components/Cms/fields';
import { Input, Select } from '../../../Components/Form';
import { useForm } from '../../../app';
import { RiDownloadLine } from 'react-icons/ri';

const TABS = [
    { id: 'client', title: 'Client', hint: 'Bill-to contact and company', panelTitle: 'Client details', panelHint: 'Who receives this invoice.' },
    { id: 'items', title: 'Line Items', hint: 'Services, quantities and pricing', panelTitle: 'Invoice items', panelHint: 'Add billable line items with tax.' },
    { id: 'settings', title: 'Settings', hint: 'Status, due date and notes', panelTitle: 'Invoice settings', panelHint: 'Payment terms and internal notes.' },
];

function money(amount) {
    return `BDT ${Number(amount || 0).toLocaleString()}`;
}

export default function InvoiceForm({ invoice, proposal, statuses, defaults, paymentMethods = [], paymentSummary }) {
    const isEdit = !!invoice;
    const form = useForm({
        proposal_id: invoice?.proposal_id ?? proposal?.id ?? defaults?.proposal_id ?? '',
        lead_id: invoice?.lead_id ?? proposal?.lead_id ?? defaults?.lead_id ?? '',
        client_name: invoice?.client_name ?? proposal?.client_name ?? defaults?.client_name ?? '',
        client_email: invoice?.client_email ?? proposal?.client_email ?? defaults?.client_email ?? '',
        client_company: invoice?.client_company ?? proposal?.client_company ?? defaults?.client_company ?? '',
        line_items: invoice?.line_items ?? proposal?.line_items ?? defaults?.line_items ?? [{ description: '', quantity: 1, unit_price: 0 }],
        due_date: (invoice?.due_date || defaults?.due_date || '').toString().slice(0, 10),
        tax_percent: invoice?.tax_percent ?? proposal?.tax_percent ?? defaults?.tax_percent ?? 0,
        status: invoice?.status ?? 'draft',
        notes: invoice?.notes ?? proposal?.notes ?? defaults?.notes ?? '',
    });

    const paymentForm = useForm({
        amount: paymentSummary?.balance_due || invoice?.total || '',
        method: 'bank_transfer',
        reference: '',
        paid_at: new Date().toISOString().slice(0, 10),
        notes: '',
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? form.put(`/admin/invoices/${invoice.id}`) : form.post('/admin/invoices');
    }

    function recordPayment(e) {
        e.preventDefault();
        paymentForm.post(`/admin/invoices/${invoice.id}/payments`, {
            preserveScroll: true,
            onSuccess: () => paymentForm.reset('reference', 'notes'),
        });
    }

    const statusLabel = statuses.find((s) => s.value === form.data.status)?.label || form.data.status;

    return (
        <AdminLayout
            title={isEdit ? invoice.invoice_number : 'New Invoice'}
            subtitle={isEdit ? `Bill to ${invoice.client_name}` : 'Create a billable invoice with PDF export.'}
            actions={isEdit ? (
                <a href={`/admin/invoices/${invoice.id}/pdf`} className="admin-topbar-btn" target="_blank" rel="noreferrer"><RiDownloadLine /> Download PDF</a>
            ) : null}
        >
            {proposal && (
                <p className="admin-sales-context">From proposal {proposal.number}</p>
            )}

            <SalesEditorShell
                title="Invoices"
                subtitle={isEdit ? invoice.invoice_number : 'New invoice'}
                tabs={TABS}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/invoices"
                statusLabel={statusLabel}
                saveLabel={isEdit ? 'Save invoice' : 'Create invoice'}
            >
                {(tab) => {
                    if (tab === 'client') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Client name" error={form.errors.client_name}>
                                    <Input value={form.data.client_name} onChange={(e) => form.setData('client_name', e.target.value)} required />
                                </FieldShell>
                                <FieldShell label="Client email" error={form.errors.client_email}>
                                    <Input type="email" value={form.data.client_email} onChange={(e) => form.setData('client_email', e.target.value)} required />
                                </FieldShell>
                                <FieldShell label="Company" wide>
                                    <Input value={form.data.client_company} onChange={(e) => form.setData('client_company', e.target.value)} />
                                </FieldShell>
                            </div>
                        );
                    }

                    if (tab === 'items') {
                        return (
                            <>
                                <LineItemsEditor items={form.data.line_items} taxPercent={form.data.tax_percent} onChange={(items) => form.setData('line_items', items)} />
                                <div className="cms-form-grid" style={{ marginTop: '1rem' }}>
                                    <FieldShell label="Tax %" hint="Applied to subtotal before total.">
                                        <Input type="number" min="0" max="100" value={form.data.tax_percent} onChange={(e) => form.setData('tax_percent', e.target.value)} />
                                    </FieldShell>
                                </div>
                            </>
                        );
                    }

                    return (
                        <div className="cms-form-grid">
                            <FieldShell label="Status">
                                <Select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                    {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </Select>
                            </FieldShell>
                            <FieldShell label="Due date">
                                <Input type="date" value={form.data.due_date} onChange={(e) => form.setData('due_date', e.target.value)} />
                            </FieldShell>
                            <FieldShell label="Internal notes" hint="Visible on PDF and client portal." wide>
                                <RichTextEditor compact value={form.data.notes} onChange={(next) => form.setData('notes', next)} minHeight="8rem" />
                            </FieldShell>
                        </div>
                    );
                }}
            </SalesEditorShell>

            {isEdit && paymentSummary && (
                <section className="resource-editor-card admin-payments-panel">
                    <header className="resource-editor-card-head">
                        <div>
                            <h3>Payments</h3>
                            <p>Record manual payments and track balance due.</p>
                        </div>
                    </header>
                    <div className="resource-editor-card-body">
                        <div className="admin-payment-summary">
                            <div><span>Invoice total</span><strong>{money(invoice.total)}</strong></div>
                            <div><span>Paid</span><strong>{money(paymentSummary.paid_total)}</strong></div>
                            <div className="is-balance"><span>Balance due</span><strong>{money(paymentSummary.balance_due)}</strong></div>
                        </div>

                        {(invoice.payments || []).length > 0 && (
                            <div className="admin-payment-list">
                                {invoice.payments.map((payment) => (
                                    <div key={payment.id} className="admin-payment-row">
                                        <div>
                                            <strong>{money(payment.amount)}</strong>
                                            <span>{payment.method_label} · {new Date(payment.paid_at).toLocaleDateString()}</span>
                                            {payment.reference && <small>Ref: {payment.reference}</small>}
                                        </div>
                                        <em>{payment.recorder?.name || 'System'}</em>
                                    </div>
                                ))}
                            </div>
                        )}

                        {paymentSummary.balance_due > 0 && (
                            <form onSubmit={recordPayment} className="admin-payment-form">
                                <div className="cms-form-grid">
                                    <FieldShell label="Amount">
                                        <Input type="number" min="1" value={paymentForm.data.amount} onChange={(e) => paymentForm.setData('amount', e.target.value)} required />
                                    </FieldShell>
                                    <FieldShell label="Method">
                                        <Select value={paymentForm.data.method} onChange={(e) => paymentForm.setData('method', e.target.value)}>
                                            {paymentMethods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </Select>
                                    </FieldShell>
                                    <FieldShell label="Reference">
                                        <Input value={paymentForm.data.reference} onChange={(e) => paymentForm.setData('reference', e.target.value)} />
                                    </FieldShell>
                                    <FieldShell label="Paid on">
                                        <Input type="date" value={paymentForm.data.paid_at} onChange={(e) => paymentForm.setData('paid_at', e.target.value)} />
                                    </FieldShell>
                                    <FieldShell label="Payment notes" wide>
                                        <RichTextEditor compact value={paymentForm.data.notes} onChange={(next) => paymentForm.setData('notes', next)} minHeight="5rem" />
                                    </FieldShell>
                                </div>
                                <button type="submit" disabled={paymentForm.processing} className="resource-editor-btn is-secondary">Record payment</button>
                            </form>
                        )}
                    </div>
                </section>
            )}
        </AdminLayout>
    );
}
