import { useMemo, useState } from 'react';
import { Link } from '../../../app';
import PortalLayout from '../../../Layouts/PortalLayout';
import { RiCalendarCheckLine } from 'react-icons/ri';

export default function MeetingsIndex({ bookings }) {
    const [filter, setFilter] = useState('upcoming');

    const now = Date.now();

    const stats = useMemo(() => ({
        total: bookings.length,
        upcoming: bookings.filter((b) => new Date(b.scheduled_at).getTime() >= now && ['pending', 'confirmed'].includes(b.status)).length,
        completed: bookings.filter((b) => b.status === 'completed').length,
    }), [bookings, now]);

    const filtered = useMemo(() => {
        if (filter === 'all') return bookings;
        if (filter === 'upcoming') {
            return bookings.filter((b) => new Date(b.scheduled_at).getTime() >= now && ['pending', 'confirmed'].includes(b.status));
        }
        return bookings.filter((b) => b.status === filter);
    }, [bookings, filter, now]);

    return (
        <PortalLayout
            title="Meetings"
            subtitle="Your scheduled calls with our team."
            actions={<Link href="/book" className="portal-btn is-primary">Book a meeting</Link>}
        >
            <div className="portal-kpi-grid portal-kpi-grid-3">
                <div className="portal-kpi"><span>Total</span><strong>{stats.total}</strong></div>
                <div className="portal-kpi"><span>Upcoming</span><strong>{stats.upcoming}</strong></div>
                <div className="portal-kpi"><span>Completed</span><strong>{stats.completed}</strong></div>
            </div>

            {bookings.length > 0 && (
                <div className="portal-filter-row">
                    {[
                        ['upcoming', 'Upcoming'],
                        ['all', 'All'],
                        ['confirmed', 'Confirmed'],
                        ['pending', 'Pending'],
                        ['completed', 'Completed'],
                        ['cancelled', 'Cancelled'],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={`portal-filter-pill ${filter === value ? 'is-active' : ''}`}
                            onClick={() => setFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="portal-empty">
                    <RiCalendarCheckLine className="portal-empty-icon" />
                    <h3>{bookings.length === 0 ? 'No meetings yet' : 'No meetings match this filter'}</h3>
                    <p><Link href="/book">Book a discovery call</Link> to get started.</p>
                </div>
            ) : (
                <div className="portal-cards portal-cards-rich">
                    {filtered.map((b) => (
                        <div key={b.id} className="portal-card portal-card-rich is-static">
                            <div className="portal-card-icon"><RiCalendarCheckLine /></div>
                            <div className="portal-card-body">
                                <strong>{b.meeting_type?.name}</strong>
                                <h3>{new Date(b.scheduled_at).toLocaleString()}</h3>
                                <p>{b.notes || 'No additional notes'}</p>
                            </div>
                            <div className="portal-card-meta">
                                <span className={`portal-badge is-${b.status}`}>{b.status_label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
