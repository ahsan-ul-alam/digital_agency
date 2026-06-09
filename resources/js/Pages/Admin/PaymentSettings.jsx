import AdminLayout from '../../Layouts/AdminLayout';
import SalesEditorShell from '../../Components/Admin/SalesEditorShell';
import RichTextEditor from '../../Components/Cms/RichTextEditor';
import { FieldShell, ToggleField } from '../../Components/Cms/fields';
import { Input } from '../../Components/Form';
import { useForm } from '../../app';
import { RiBankLine, RiSecurePaymentLine, RiWallet3Line } from 'react-icons/ri';

const TABS = [
    { id: 'bank', title: 'Bank Transfer', hint: 'Manual payment instructions', icon: RiBankLine, panelTitle: 'Bank transfer details', panelHint: 'Shown on client portal invoices for manual payments.' },
    { id: 'bkash', title: 'bKash', hint: 'Tokenized checkout API', icon: RiWallet3Line, panelTitle: 'bKash checkout', panelHint: 'Direct bKash Tokenized Checkout for client portal invoices.' },
    { id: 'eps', title: 'EPS', hint: 'Multi-method gateway', icon: RiSecurePaymentLine, panelTitle: 'EPS gateway', panelHint: 'Easy Payment System — cards, bKash and more through one checkout.' },
];

export default function PaymentSettings({ settings, hasSecrets = {}, callbackUrls = {} }) {
    const form = useForm({
        bank_name: settings.bank_name || '',
        account_name: settings.account_name || '',
        account_number: settings.account_number || '',
        routing_or_mobile: settings.routing_or_mobile || '',
        instructions: settings.instructions || '',
        support_email: settings.support_email || '',
        bkash_enabled: Boolean(settings.bkash_enabled),
        bkash_sandbox: settings.bkash_sandbox !== false,
        bkash_username: settings.bkash_username || '',
        bkash_password: '',
        bkash_app_key: settings.bkash_app_key || '',
        bkash_app_secret: '',
        bkash_display_number: settings.bkash_display_number || '',
        eps_enabled: Boolean(settings.eps_enabled),
        eps_sandbox: settings.eps_sandbox !== false,
        eps_merchant_id: settings.eps_merchant_id || '',
        eps_store_id: settings.eps_store_id || '',
        eps_username: settings.eps_username || '',
        eps_password: '',
        eps_hash_key: '',
    });

    function submit(e) {
        e.preventDefault();
        form.put('/admin/payments/settings');
    }

    const activeGateways = [
        form.data.bkash_enabled && 'bKash',
        form.data.eps_enabled && 'EPS',
        form.data.bank_name && 'Bank',
    ].filter(Boolean);

    return (
        <AdminLayout title="Payment Settings" subtitle="Bank instructions, bKash checkout, and EPS gateway for client portal invoices.">
            <SalesEditorShell
                title="Payments"
                subtitle="Client portal checkout"
                tabs={TABS}
                onSubmit={submit}
                processing={form.processing}
                statusLabel={activeGateways.length ? activeGateways.join(' · ') : 'Not configured'}
                saveLabel="Save settings"
            >
                {(tab) => {
                    if (tab === 'bank') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Bank name"><Input value={form.data.bank_name} onChange={(e) => form.setData('bank_name', e.target.value)} /></FieldShell>
                                <FieldShell label="Account name"><Input value={form.data.account_name} onChange={(e) => form.setData('account_name', e.target.value)} /></FieldShell>
                                <FieldShell label="Account number"><Input value={form.data.account_number} onChange={(e) => form.setData('account_number', e.target.value)} /></FieldShell>
                                <FieldShell label="Routing / manual bKash" hint="Personal bKash number for manual transfer.">
                                    <Input value={form.data.routing_or_mobile} onChange={(e) => form.setData('routing_or_mobile', e.target.value)} placeholder="01XXXXXXXXX" />
                                </FieldShell>
                                <FieldShell label="Payment support email">
                                    <Input type="email" value={form.data.support_email} onChange={(e) => form.setData('support_email', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Instructions for clients" wide>
                                    <RichTextEditor compact value={form.data.instructions} onChange={(next) => form.setData('instructions', next)} minHeight="7rem" />
                                </FieldShell>
                            </div>
                        );
                    }

                    if (tab === 'bkash') {
                        return (
                            <div className="cms-form-grid">
                                <ToggleField label="Enable bKash" hint="Show Pay with bKash on portal invoices." checked={form.data.bkash_enabled} onChange={(v) => form.setData('bkash_enabled', v)} />
                                <ToggleField label="Sandbox mode" hint="Use bKash sandbox credentials for testing." checked={form.data.bkash_sandbox} onChange={(v) => form.setData('bkash_sandbox', v)} />
                                <FieldShell label="Display number (optional)" hint="Shown as manual fallback on portal.">
                                    <Input value={form.data.bkash_display_number} onChange={(e) => form.setData('bkash_display_number', e.target.value)} placeholder="01XXXXXXXXX" />
                                </FieldShell>
                                <FieldShell label="Username"><Input value={form.data.bkash_username} onChange={(e) => form.setData('bkash_username', e.target.value)} /></FieldShell>
                                <FieldShell label="Password"><Input type="password" value={form.data.bkash_password} onChange={(e) => form.setData('bkash_password', e.target.value)} placeholder={hasSecrets.bkash_password ? 'Saved — leave blank to keep' : ''} /></FieldShell>
                                <FieldShell label="App key"><Input value={form.data.bkash_app_key} onChange={(e) => form.setData('bkash_app_key', e.target.value)} /></FieldShell>
                                <FieldShell label="App secret"><Input type="password" value={form.data.bkash_app_secret} onChange={(e) => form.setData('bkash_app_secret', e.target.value)} placeholder={hasSecrets.bkash_app_secret ? 'Saved — leave blank to keep' : ''} /></FieldShell>
                                {callbackUrls.bkash && <p className="admin-panel-note cms-field is-wide">Callback URL: <code>{callbackUrls.bkash}</code></p>}
                            </div>
                        );
                    }

                    return (
                        <div className="cms-form-grid">
                            <ToggleField label="Enable EPS" hint="Show Pay with EPS on portal invoices." checked={form.data.eps_enabled} onChange={(v) => form.setData('eps_enabled', v)} />
                            <ToggleField label="Sandbox mode" checked={form.data.eps_sandbox} onChange={(v) => form.setData('eps_sandbox', v)} />
                            <FieldShell label="Merchant ID"><Input value={form.data.eps_merchant_id} onChange={(e) => form.setData('eps_merchant_id', e.target.value)} /></FieldShell>
                            <FieldShell label="Store ID"><Input value={form.data.eps_store_id} onChange={(e) => form.setData('eps_store_id', e.target.value)} /></FieldShell>
                            <FieldShell label="Username"><Input value={form.data.eps_username} onChange={(e) => form.setData('eps_username', e.target.value)} /></FieldShell>
                            <FieldShell label="Password"><Input type="password" value={form.data.eps_password} onChange={(e) => form.setData('eps_password', e.target.value)} placeholder={hasSecrets.eps_password ? 'Saved — leave blank to keep' : ''} /></FieldShell>
                            <FieldShell label="Hash key"><Input type="password" value={form.data.eps_hash_key} onChange={(e) => form.setData('eps_hash_key', e.target.value)} placeholder={hasSecrets.eps_hash_key ? 'Saved — leave blank to keep' : ''} /></FieldShell>
                            <div className="admin-callback-urls cms-field is-wide">
                                {callbackUrls.eps_success && <p className="admin-panel-note">Success URL: <code>{callbackUrls.eps_success}</code></p>}
                                {callbackUrls.eps_fail && <p className="admin-panel-note">Fail URL: <code>{callbackUrls.eps_fail}</code></p>}
                                {callbackUrls.eps_cancel && <p className="admin-panel-note">Cancel URL: <code>{callbackUrls.eps_cancel}</code></p>}
                                {callbackUrls.eps_ipn && <p className="admin-panel-note">IPN URL: <code>{callbackUrls.eps_ipn}</code></p>}
                            </div>
                        </div>
                    );
                }}
            </SalesEditorShell>
        </AdminLayout>
    );
}
