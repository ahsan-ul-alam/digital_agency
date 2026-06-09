import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import RichTextEditor from '../../Components/Cms/RichTextEditor';
import { Input, Select } from '../../Components/Form';
import { Link, router, useForm } from '../../app';
import {
    RiArrowLeftLine,
    RiCalendarCheckLine,
    RiCalendarTodoLine,
    RiChat3Line,
    RiDeleteBinLine,
    RiHistoryLine,
    RiMailLine,
    RiMailSendLine,
    RiPhoneLine,
    RiUser3Line,
} from 'react-icons/ri';

const LEAD_TABS = [
    { id: 'overview', title: 'Overview', hint: 'Message and source details', icon: RiUser3Line },
    { id: 'timeline', title: 'Timeline', hint: 'Activity history', icon: RiHistoryLine },
    { id: 'notes', title: 'Notes', hint: 'Internal team notes', icon: RiChat3Line },
    { id: 'followups', title: 'Follow-ups', hint: 'Scheduled tasks', icon: RiCalendarTodoLine },
];

const STATUS_CLASS = {
    new: 'is-new',
    contacted: 'is-contacted',
    qualified: 'is-qualified',
    proposal_sent: 'is-proposal',
    won: 'is-won',
    lost: 'is-lost',
};

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function replyMailto(lead) {
    const subject = encodeURIComponent(`Re: ${lead.service ? `Inquiry: ${lead.service}` : 'Your project inquiry'}`);
    const body = encodeURIComponent(`Hi ${lead.name},\n\nThank you for reaching out to AR Soft BD.\n\n`);
    return `mailto:${lead.email}?subject=${subject}&body=${body}`;
}

function SourceFields({ lead }) {
    const fields = lead.source_meta?.fields;
    if (!fields || typeof fields !== 'object') return null;

    return (
        <div className="admin-crm-source-fields">
            {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="admin-crm-source-row">
                    <span>{key}</span>
                    <strong>{String(value)}</strong>
                </div>
            ))}
        </div>
    );
}

export default function LeadShow({ lead, statuses = [], users = [], timeline = [] }) {
    const [tab, setTab] = useState('overview');
    const statusForm = useForm({ status: lead.status, assigned_to: lead.assigned_to || '' });
    const noteForm = useForm({ body: '' });
    const followupForm = useForm({
        title: 'Follow up call',
        notes: '',
        due_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    });

    function updateLead() {
        statusForm.put(`/admin/leads/${lead.id}`, { preserveScroll: true });
    }

    function addNote(e) {
        e.preventDefault();
        noteForm.post(`/admin/leads/${lead.id}/notes`, {
            preserveScroll: true,
            onSuccess: () => noteForm.reset(),
        });
    }

    function addFollowup(e) {
        e.preventDefault();
        followupForm.post(`/admin/leads/${lead.id}/followups`, {
            preserveScroll: true,
            onSuccess: () => followupForm.reset('notes'),
        });
    }

    function completeFollowup(id) {
        router.post(`/admin/leads/${lead.id}/followups/${id}/complete`, {}, { preserveScroll: true });
    }

    function remove() {
        if (!window.confirm('Delete this lead permanently?')) return;
        router.delete(`/admin/leads/${lead.id}`);
    }

    return (
        <AdminLayout
            title={lead.name}
            subtitle={`${lead.email} · ${lead.source_label || lead.source}`}
            actions={(
                <>
                    <Link href={`/admin/proposals/create?lead_id=${lead.id}`} className="admin-topbar-btn">Create Proposal</Link>
                    {lead.client_user ? (
                        <>
                            <span className="admin-topbar-btn opacity-80">Portal active</span>
                            <button
                                type="button"
                                className="admin-topbar-btn"
                                onClick={() => window.confirm(`Generate a new portal password for ${lead.email}?`) && router.post(`/admin/leads/${lead.id}/regenerate-portal-password`)}
                            >
                                Regenerate password
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="admin-topbar-btn"
                            onClick={() => window.confirm(`Send client portal invite to ${lead.email}?`) && router.post(`/admin/leads/${lead.id}/invite-portal`)}
                        >
                            Invite to Portal
                        </button>
                    )}
                    <a href={replyMailto(lead)} className="admin-topbar-primary">
                        <RiMailSendLine /> Reply via Email
                    </a>
                </>
            )}
        >
            <div className="admin-mail-back">
                <Link href="/admin/leads" className="admin-mail-back-link">
                    <RiArrowLeftLine /> Back to pipeline
                </Link>
            </div>

            <div className="admin-crm-layout resource-editor">
                <aside className="admin-crm-sidebar resource-editor-side">
                    <section className="admin-crm-card">
                        <div className="admin-crm-card-head">
                            <span className="admin-mail-avatar">{lead.name?.charAt(0)?.toUpperCase() || '?'}</span>
                            <div>
                                <h2>{lead.name}</h2>
                                <a href={`mailto:${lead.email}`}>{lead.email}</a>
                            </div>
                        </div>

                        <div className="admin-crm-meta-list">
                            {lead.phone && <p><RiPhoneLine /> {lead.phone}</p>}
                            {lead.company && <p><strong>Company:</strong> {lead.company}</p>}
                            {lead.service && <p><strong>Service:</strong> {lead.service}</p>}
                            {lead.budget && <p><strong>Budget:</strong> {lead.budget}</p>}
                            <p><RiMailLine /> Received {formatDate(lead.created_at)}</p>
                            {lead.read_at && <p>Read {formatDate(lead.read_at)}</p>}
                        </div>
                    </section>

                    <section className="admin-crm-card">
                        <h3>Pipeline</h3>
                        <label className="admin-crm-field">
                            <span>Status</span>
                            <Select
                                value={statusForm.data.status}
                                onChange={(e) => {
                                    statusForm.setData('status', e.target.value);
                                    statusForm.put(`/admin/leads/${lead.id}`, { preserveScroll: true });
                                }}
                            >
                                {statuses.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </Select>
                        </label>
                        <label className="admin-crm-field">
                            <span>Assigned to</span>
                            <Select
                                value={statusForm.data.assigned_to}
                                onChange={(e) => {
                                    statusForm.setData('assigned_to', e.target.value);
                                    updateLead();
                                }}
                            >
                                <option value="">Unassigned</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </Select>
                        </label>
                        <p className="admin-crm-current-status">
                            Current stage:
                            <span className={`admin-crm-badge ${STATUS_CLASS[lead.status] || ''}`}>
                                {statuses.find((s) => s.value === lead.status)?.label || lead.status}
                            </span>
                        </p>
                    </section>

                    <button type="button" className="admin-mail-action is-danger admin-crm-delete" onClick={remove}>
                        <RiDeleteBinLine /> Delete lead
                    </button>
                </aside>

                <div className="admin-crm-main resource-editor-main">
                    <nav className="resource-editor-tabs admin-crm-workspace-tabs">
                        {LEAD_TABS.map((entry) => {
                            const Icon = entry.icon;
                            return (
                                <button
                                    key={entry.id}
                                    type="button"
                                    className={`resource-editor-tab ${tab === entry.id ? 'is-active' : ''}`}
                                    onClick={() => setTab(entry.id)}
                                >
                                    <Icon />
                                    <span>
                                        <strong>{entry.title}</strong>
                                        <small>{entry.hint}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {tab === 'overview' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <div className="admin-crm-panel-head">
                                <h3>Message</h3>
                                <span className="admin-crm-source-tag">{lead.source_label || lead.source}</span>
                            </div>
                            <div className="admin-mail-body-content">
                                {lead.message || 'No message provided.'}
                            </div>
                            {lead.source_meta?.form_name && (
                                <p className="admin-crm-form-meta">
                                    Form: {lead.source_meta.form_name}
                                    {lead.source_meta.page_url && <> · <a href={lead.source_meta.page_url} target="_blank" rel="noreferrer">Source page</a></>}
                                </p>
                            )}
                            <SourceFields lead={lead} />
                        </section>
                    )}

                    {tab === 'timeline' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <h3>Activity timeline</h3>
                            <div className="admin-crm-timeline">
                                {timeline.length === 0 ? (
                                    <p className="text-muted">No activity yet.</p>
                                ) : timeline.map((event, index) => (
                                    <div key={`${event.time}-${index}`} className="admin-crm-timeline-item">
                                        <span className="admin-crm-timeline-dot" />
                                        <div>
                                            <strong>{event.title}</strong>
                                            {event.actor && <small> · {event.actor}</small>}
                                            {event.meta && <p>{event.meta}</p>}
                                            <time>{formatDate(event.time)}</time>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {tab === 'notes' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <h3>Notes</h3>
                            <form onSubmit={addNote} className="admin-crm-note-form">
                                <RichTextEditor
                                    compact
                                    value={noteForm.data.body}
                                    onChange={(next) => noteForm.setData('body', next)}
                                    minHeight="7rem"
                                    placeholder="Add an internal note about this lead…"
                                />
                                <button type="submit" disabled={noteForm.processing} className="admin-topbar-primary">
                                    Add note
                                </button>
                            </form>
                            <div className="admin-crm-notes">
                                {(lead.notes || []).filter((n) => !n.is_system).map((note) => (
                                    <article key={note.id} className="admin-crm-note">
                                        <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: note.body }} />
                                        <footer>
                                            {note.user?.name || 'System'} · {formatDate(note.created_at)}
                                        </footer>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {tab === 'followups' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <h3>Follow-ups</h3>
                            <form onSubmit={addFollowup} className="admin-crm-followup-form">
                                <Input
                                    value={followupForm.data.title}
                                    onChange={(e) => followupForm.setData('title', e.target.value)}
                                    placeholder="Follow-up title"
                                />
                                <RichTextEditor
                                    compact
                                    value={followupForm.data.notes}
                                    onChange={(next) => followupForm.setData('notes', next)}
                                    minHeight="5rem"
                                    placeholder="Optional notes"
                                />
                                <Input
                                    type="datetime-local"
                                    value={followupForm.data.due_at}
                                    onChange={(e) => followupForm.setData('due_at', e.target.value)}
                                />
                                <button type="submit" disabled={followupForm.processing} className="admin-topbar-primary">
                                    Schedule follow-up
                                </button>
                            </form>
                            <div className="admin-crm-followups">
                                {(lead.followups || []).map((item) => (
                                    <article key={item.id} className={`admin-crm-followup${item.completed_at ? ' is-done' : ''}`}>
                                        <div>
                                            <strong>{item.title}</strong>
                                            {item.notes && <p>{item.notes}</p>}
                                            <small>Due {formatDate(item.due_at)}</small>
                                        </div>
                                        {!item.completed_at && (
                                            <button type="button" className="admin-crm-complete" onClick={() => completeFollowup(item.id)}>
                                                <RiCalendarCheckLine /> Complete
                                            </button>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
