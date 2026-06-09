import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import RichTextEditor from '../../../Components/Cms/RichTextEditor';
import { FieldShell } from '../../../Components/Cms/fields';
import { Select } from '../../../Components/Form';
import { Link, useForm } from '../../../app';
import { RiCalendarCheckLine, RiSettings3Line, RiUser3Line } from 'react-icons/ri';

const TABS = [
    { id: 'client', title: 'Client', hint: 'Contact details', icon: RiUser3Line },
    { id: 'meeting', title: 'Meeting', hint: 'Type and schedule', icon: RiCalendarCheckLine },
    { id: 'manage', title: 'Manage', hint: 'Status and notes', icon: RiSettings3Line },
];

export default function BookingShow({ booking, statuses }) {
    const [tab, setTab] = useState('client');
    const form = useForm({
        status: booking.status,
        admin_notes: booking.admin_notes ?? '',
    });

    function submit(e) {
        e.preventDefault();
        form.put(`/admin/bookings/${booking.id}`);
    }

    const statusLabel = statuses.find((s) => s.value === booking.status)?.label || booking.status;

    return (
        <AdminLayout title={booking.name} subtitle={`${booking.meeting_type?.name} · ${new Date(booking.scheduled_at).toLocaleString()}`}>
            <p className="admin-sales-context">
                <Link href="/admin/bookings">← Back to bookings</Link>
                {booking.lead_id && <> · <Link href={`/admin/leads/${booking.lead_id}`}>View lead</Link></>}
            </p>

            <form onSubmit={submit} className="resource-editor sales-editor">
                <header className="resource-editor-header">
                    <div className="resource-editor-intro">
                        <p className="resource-editor-eyebrow">Bookings</p>
                        <h2>{booking.name}</h2>
                        <span className="resource-editor-status">{statusLabel}</span>
                    </div>
                    {tab === 'manage' && (
                        <div className="resource-editor-actions">
                            <button type="submit" className="resource-editor-btn is-primary" disabled={form.processing}>
                                Save changes
                            </button>
                        </div>
                    )}
                </header>

                <div className="resource-editor-body">
                    <aside className="resource-editor-side">
                        <nav className="resource-editor-tabs">
                            {TABS.map((entry) => {
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
                    </aside>

                    <div className="resource-editor-main">
                        <section className="resource-editor-card">
                            {tab === 'client' && (
                                <>
                                    <header className="resource-editor-card-head"><h3>Client</h3></header>
                                    <div className="resource-editor-card-body">
                                        <dl className="admin-crm-dl">
                                            <div><dt>Name</dt><dd>{booking.name}</dd></div>
                                            <div><dt>Email</dt><dd>{booking.email}</dd></div>
                                            <div><dt>Phone</dt><dd>{booking.phone || '—'}</dd></div>
                                            <div><dt>Company</dt><dd>{booking.company || '—'}</dd></div>
                                        </dl>
                                    </div>
                                </>
                            )}

                            {tab === 'meeting' && (
                                <>
                                    <header className="resource-editor-card-head"><h3>Meeting</h3></header>
                                    <div className="resource-editor-card-body">
                                        <dl className="admin-crm-dl">
                                            <div><dt>Type</dt><dd>{booking.meeting_type?.name}</dd></div>
                                            <div><dt>Duration</dt><dd>{booking.meeting_type?.duration_minutes} minutes</dd></div>
                                            <div><dt>Scheduled</dt><dd>{new Date(booking.scheduled_at).toLocaleString()} ({booking.timezone})</dd></div>
                                            <div><dt>Client notes</dt><dd>{booking.notes || '—'}</dd></div>
                                        </dl>
                                    </div>
                                </>
                            )}

                            {tab === 'manage' && (
                                <>
                                    <header className="resource-editor-card-head">
                                        <div>
                                            <h3>Manage booking</h3>
                                            <p>Update status and add internal notes.</p>
                                        </div>
                                    </header>
                                    <div className="resource-editor-card-body">
                                        <div className="cms-form-grid">
                                            <FieldShell label="Status">
                                                <Select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                                    {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </Select>
                                            </FieldShell>
                                            <FieldShell label="Internal notes" wide>
                                                <RichTextEditor compact value={form.data.admin_notes} onChange={(next) => form.setData('admin_notes', next)} minHeight="7rem" />
                                            </FieldShell>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
