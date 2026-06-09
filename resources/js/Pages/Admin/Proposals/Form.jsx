import AdminLayout from '../../../Layouts/AdminLayout';
import LineItemsEditor from '../../../Components/Admin/LineItemsEditor';
import SalesEditorShell from '../../../Components/Admin/SalesEditorShell';
import RichTextEditor from '../../../Components/Cms/RichTextEditor';
import { FieldShell } from '../../../Components/Cms/fields';
import { Input, Select } from '../../../Components/Form';
import { Link, router, useForm } from '../../../app';
import { RiDownloadLine, RiMailSendLine } from 'react-icons/ri';

const TABS = [
    { id: 'client', title: 'Client', hint: 'Contact and company details', panelTitle: 'Client details', panelHint: 'Who receives this proposal.' },
    { id: 'proposal', title: 'Proposal', hint: 'Scope, timeline and pricing', panelTitle: 'Proposal content', panelHint: 'Title, delivery timeline and line items.' },
    { id: 'settings', title: 'Settings', hint: 'Status, validity and notes', panelTitle: 'Proposal settings', panelHint: 'Workflow status and internal notes.' },
];

export default function ProposalForm({ proposal, lead, statuses, defaults }) {
    const isEdit = !!proposal;
    const form = useForm({
        lead_id: proposal?.lead_id ?? lead?.id ?? defaults?.lead_id ?? '',
        client_name: proposal?.client_name ?? defaults?.client_name ?? '',
        client_email: proposal?.client_email ?? defaults?.client_email ?? '',
        client_company: proposal?.client_company ?? defaults?.client_company ?? '',
        title: proposal?.title ?? defaults?.title ?? '',
        line_items: proposal?.line_items ?? defaults?.line_items ?? [{ description: '', quantity: 1, unit_price: 0 }],
        timeline: proposal?.timeline ?? defaults?.timeline ?? '',
        valid_until: (proposal?.valid_until || defaults?.valid_until || '').toString().slice(0, 10),
        tax_percent: proposal?.tax_percent ?? defaults?.tax_percent ?? 0,
        status: proposal?.status ?? 'draft',
        notes: proposal?.notes ?? defaults?.notes ?? '',
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? form.put(`/admin/proposals/${proposal.id}`) : form.post('/admin/proposals');
    }

    function sendEmail() {
        if (!window.confirm(`Email proposal to ${form.data.client_email}?`)) return;
        router.post(`/admin/proposals/${proposal.id}/send`, {}, { preserveScroll: true });
    }

    const statusLabel = statuses.find((s) => s.value === form.data.status)?.label || form.data.status;

    const headerActions = isEdit ? (
        <>
            <a href={`/admin/proposals/${proposal.id}/pdf`} className="resource-editor-btn is-ghost" target="_blank" rel="noreferrer">
                <RiDownloadLine /> PDF
            </a>
            <Link href={`/admin/invoices/create?proposal_id=${proposal.id}`} className="resource-editor-btn is-ghost">Create Invoice</Link>
            <button type="button" className="resource-editor-btn is-secondary" onClick={sendEmail}>
                <RiMailSendLine /> Email client
            </button>
        </>
    ) : null;

    return (
        <AdminLayout
            title={isEdit ? proposal.number : 'New Proposal'}
            subtitle={isEdit ? proposal.title : 'Build a client-ready proposal with line items and PDF export.'}
        >
            {lead && (
                <p className="admin-sales-context">Linked lead: <Link href={`/admin/leads/${lead.id}`}>{lead.name}</Link></p>
            )}

            <SalesEditorShell
                title="Proposals"
                subtitle={isEdit ? proposal.number : 'New proposal'}
                tabs={TABS}
                onSubmit={submit}
                processing={form.processing}
                cancelHref="/admin/proposals"
                statusLabel={statusLabel}
                saveLabel={isEdit ? 'Save proposal' : 'Create proposal'}
                headerActions={headerActions}
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

                    if (tab === 'proposal') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Proposal title" wide error={form.errors.title}>
                                    <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                                </FieldShell>
                                <FieldShell label="Delivery timeline" hint="e.g. 6–8 weeks">
                                    <Input value={form.data.timeline} onChange={(e) => form.setData('timeline', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Valid until">
                                    <Input type="date" value={form.data.valid_until} onChange={(e) => form.setData('valid_until', e.target.value)} />
                                </FieldShell>
                                <div className="cms-field is-wide">
                                    <LineItemsEditor items={form.data.line_items} taxPercent={form.data.tax_percent} onChange={(items) => form.setData('line_items', items)} />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="cms-form-grid">
                            <FieldShell label="Status">
                                <Select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                    {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </Select>
                            </FieldShell>
                            <FieldShell label="Tax %">
                                <Input type="number" min="0" max="100" value={form.data.tax_percent} onChange={(e) => form.setData('tax_percent', e.target.value)} />
                            </FieldShell>
                            <FieldShell label="Internal notes" wide>
                                <RichTextEditor compact value={form.data.notes} onChange={(next) => form.setData('notes', next)} minHeight="8rem" />
                            </FieldShell>
                        </div>
                    );
                }}
            </SalesEditorShell>
        </AdminLayout>
    );
}
