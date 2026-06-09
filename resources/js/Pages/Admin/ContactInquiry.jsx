import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Link, router } from '../../app';
import {
    RiArrowLeftLine,
    RiBuildingLine,
    RiCalendarLine,
    RiDeleteBinLine,
    RiFileList3Line,
    RiHistoryLine,
    RiMailLine,
    RiMailSendLine,
    RiMailUnreadLine,
    RiMessage3Line,
    RiMoneyDollarCircleLine,
    RiPhoneLine,
    RiServiceLine,
} from 'react-icons/ri';

const INQUIRY_TABS = [
    { id: 'message', title: 'Message', hint: 'Full inquiry text', icon: RiMessage3Line },
    { id: 'details', title: 'Details', hint: 'Contact and project info', icon: RiFileList3Line },
    { id: 'activity', title: 'Activity', hint: 'Received and read times', icon: RiHistoryLine },
];

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

function mailSubject(inquiry) {
    if (inquiry.service) return `Inquiry: ${inquiry.service}`;
    return 'New project inquiry';
}

function replyMailto(inquiry) {
    const subject = encodeURIComponent(`Re: ${mailSubject(inquiry)}`);
    const body = encodeURIComponent(
        `Hi ${inquiry.name},\n\nThank you for contacting AR Soft BD.\n\n`,
    );
    return `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
}

function DetailRow({ icon: Icon, label, value }) {
    if (!value) return null;

    return (
        <div className="admin-crm-source-row admin-inquiry-detail-row">
            <span className="admin-inquiry-detail-label">
                <Icon /> {label}
            </span>
            <strong>{value}</strong>
        </div>
    );
}

export default function ContactInquiry({ inquiry }) {
    const [tab, setTab] = useState('message');
    const subject = mailSubject(inquiry);
    const isUnread = !inquiry.read_at;

    function remove() {
        if (!window.confirm('Delete this inquiry permanently?')) return;
        router.delete(`/admin/contacts/${inquiry.id}`);
    }

    return (
        <AdminLayout
            title={inquiry.name}
            subtitle={`${inquiry.email} · ${inquiry.service || 'General inquiry'}`}
            actions={(
                <a href={replyMailto(inquiry)} className="admin-topbar-primary">
                    <RiMailSendLine /> Reply via Email
                </a>
            )}
        >
            <div className="admin-mail-back">
                <Link href="/admin/contacts" className="admin-mail-back-link">
                    <RiArrowLeftLine /> Back to inbox
                </Link>
            </div>

            <div className="admin-crm-layout resource-editor">
                <aside className="admin-crm-sidebar resource-editor-side">
                    <section className="admin-crm-card">
                        <div className="admin-crm-card-head">
                            <span className="admin-mail-avatar">{inquiry.name?.charAt(0)?.toUpperCase() || '?'}</span>
                            <div>
                                <h2>{inquiry.name}</h2>
                                <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                            </div>
                        </div>

                        <div className="admin-crm-meta-list">
                            {inquiry.phone && <p><RiPhoneLine /> {inquiry.phone}</p>}
                            {inquiry.company && <p><strong>Company:</strong> {inquiry.company}</p>}
                            {inquiry.service && <p><strong>Service:</strong> {inquiry.service}</p>}
                            {inquiry.budget && <p><strong>Budget:</strong> {inquiry.budget}</p>}
                            <p><RiMailLine /> Received {formatDate(inquiry.created_at)}</p>
                            {inquiry.read_at && <p>Read {formatDate(inquiry.read_at)}</p>}
                        </div>
                    </section>

                    <section className="admin-crm-card">
                        <h3>Inbox status</h3>
                        <p className="admin-inquiry-status-card">
                            <span className={`admin-inquiry-status${isUnread ? ' is-unread' : ' is-read'}`}>
                                {isUnread ? <RiMailUnreadLine /> : <RiMailLine />}
                                {isUnread ? 'Unread' : 'Read'}
                            </span>
                        </p>
                        <p className="admin-inquiry-subject-preview">
                            <strong>Subject</strong>
                            <span>{subject}</span>
                        </p>
                    </section>

                    <a href={replyMailto(inquiry)} className="admin-mail-action is-primary admin-crm-reply">
                        <RiMailSendLine /> Reply via Email
                    </a>

                    <button type="button" className="admin-mail-action is-danger admin-crm-delete" onClick={remove}>
                        <RiDeleteBinLine /> Delete inquiry
                    </button>
                </aside>

                <div className="admin-crm-main resource-editor-main">
                    <nav className="resource-editor-tabs admin-crm-workspace-tabs">
                        {INQUIRY_TABS.map((entry) => {
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

                    {tab === 'message' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <div className="admin-crm-panel-head">
                                <h3>{subject}</h3>
                                <span className={`admin-inquiry-status${isUnread ? ' is-unread' : ' is-read'}`}>
                                    {isUnread ? 'Unread' : 'Read'}
                                </span>
                            </div>
                            <div className="admin-mail-body-content admin-inquiry-message">
                                {inquiry.message || 'No message provided.'}
                            </div>
                        </section>
                    )}

                    {tab === 'details' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <h3>Contact & project details</h3>
                            <div className="admin-crm-source-fields admin-inquiry-details">
                                <DetailRow icon={RiMailLine} label="Email" value={inquiry.email} />
                                <DetailRow icon={RiPhoneLine} label="Phone" value={inquiry.phone} />
                                <DetailRow icon={RiBuildingLine} label="Company" value={inquiry.company} />
                                <DetailRow icon={RiServiceLine} label="Service" value={inquiry.service} />
                                <DetailRow icon={RiMoneyDollarCircleLine} label="Budget" value={inquiry.budget} />
                            </div>
                        </section>
                    )}

                    {tab === 'activity' && (
                        <section className="admin-crm-panel resource-editor-card">
                            <h3>Activity</h3>
                            <div className="admin-crm-timeline">
                                <div className="admin-crm-timeline-item">
                                    <span className="admin-crm-timeline-dot" />
                                    <div>
                                        <strong>Inquiry received</strong>
                                        <p>Submitted via website contact form</p>
                                        <time><RiCalendarLine /> {formatDate(inquiry.created_at)}</time>
                                    </div>
                                </div>
                                {inquiry.read_at ? (
                                    <div className="admin-crm-timeline-item">
                                        <span className="admin-crm-timeline-dot" />
                                        <div>
                                            <strong>Marked as read</strong>
                                            <p>Opened in admin inbox</p>
                                            <time><RiCalendarLine /> {formatDate(inquiry.read_at)}</time>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="admin-crm-timeline-item">
                                        <span className="admin-crm-timeline-dot" />
                                        <div>
                                            <strong>Awaiting review</strong>
                                            <p>This inquiry has not been opened yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
