import { useEffect, useState } from 'react';
import axios from 'axios';
import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import { Input, Textarea } from '../../Components/Form';
import { useForm } from '../../app';
import { RiCalendarCheckLine } from 'react-icons/ri';

export default function BookMeeting({ types, dates, settings }) {
    const [selectedType, setSelectedType] = useState(types[0]?.id ?? null);
    const [selectedDate, setSelectedDate] = useState(dates[0]?.value ?? '');
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const form = useForm({
        meeting_type_id: selectedType,
        scheduled_at: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
    });

    useEffect(() => {
        if (!selectedType || !selectedDate) {
            setSlots([]);
            return;
        }

        setLoadingSlots(true);
        axios.get('/book/slots', { params: { meeting_type_id: selectedType, date: selectedDate } })
            .then((res) => setSlots(res.data.slots || []))
            .catch(() => setSlots([]))
            .finally(() => setLoadingSlots(false));
    }, [selectedType, selectedDate]);

    useEffect(() => {
        form.setData('meeting_type_id', selectedType);
    }, [selectedType]);

    function submit(e) {
        e.preventDefault();
        form.post('/book');
    }

    const activeType = types.find((t) => t.id === selectedType);

    return (
        <PublicLayout title="Book a Meeting">
            <Section eyebrow="Schedule" title="Book a call with AR Soft BD" subtitle="Pick a meeting type, choose an open slot, and tell us about your project.">
                <div className="book-grid">
                    <Card className="book-types">
                        <div className="book-types-head">
                            <RiCalendarCheckLine className="text-3xl text-primary" />
                            <div>
                                <h3>Meeting types</h3>
                                <p className="text-sm text-muted">Timezone: {settings.timezone}</p>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            {types.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    className={`quote-type-card ${selectedType === type.id ? 'is-active' : ''}`}
                                    onClick={() => setSelectedType(type.id)}
                                >
                                    <strong>{type.name}</strong>
                                    <span className="text-sm text-muted">{type.duration_minutes} min</span>
                                    {type.description && <p className="text-sm text-muted">{type.description}</p>}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <form onSubmit={submit} className="grid gap-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-muted">Date</span>
                                    <select
                                        className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            form.setData('scheduled_at', '');
                                        }}
                                    >
                                        {dates.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                                    </select>
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-semibold text-muted">Time slot</span>
                                    <select
                                        className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm"
                                        value={form.data.scheduled_at}
                                        onChange={(e) => form.setData('scheduled_at', e.target.value)}
                                        required
                                        disabled={loadingSlots || slots.length === 0}
                                    >
                                        <option value="">{loadingSlots ? 'Loading…' : slots.length ? 'Select a slot' : 'No slots available'}</option>
                                        {slots.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                                    </select>
                                </label>
                            </div>

                            {activeType && (
                                <p className="text-sm text-muted">Booking: <strong>{activeType.name}</strong> ({activeType.duration_minutes} minutes)</p>
                            )}

                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="grid gap-2"><span className="text-sm text-muted">Name</span><Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required /></label>
                                <label className="grid gap-2"><span className="text-sm text-muted">Email</span><Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} required /></label>
                                <label className="grid gap-2"><span className="text-sm text-muted">Phone</span><Input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} /></label>
                                <label className="grid gap-2"><span className="text-sm text-muted">Company</span><Input value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} /></label>
                            </div>

                            <label className="grid gap-2">
                                <span className="text-sm text-muted">Notes</span>
                                <Textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={4} placeholder="What would you like to discuss?" />
                            </label>

                            <button type="submit" disabled={form.processing || !form.data.scheduled_at} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">
                                Book meeting
                            </button>
                        </form>
                    </Card>
                </div>
            </Section>
        </PublicLayout>
    );
}
