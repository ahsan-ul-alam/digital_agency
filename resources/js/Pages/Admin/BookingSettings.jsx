import AdminLayout from '../../Layouts/AdminLayout';
import ResourceEditorShell from '../../Components/Admin/ResourceEditorShell';
import { FieldShell } from '../../Components/Cms/fields';
import { Checkbox, Input } from '../../Components/Form';
import { useForm } from '../../app';

const WEEKDAYS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
];

const tabs = [
    {
        id: 'content',
        title: 'Schedule',
        hint: 'Hours, slots and timezone',
        sections: [
            { id: 'schedule', title: 'Availability', description: 'Configure when clients can book on the public /book page.' },
        ],
    },
    {
        id: 'settings',
        title: 'Days',
        hint: 'Working days of the week',
        sections: [
            { id: 'weekdays', title: 'Working days', description: 'Select which days appear on the booking calendar.' },
        ],
    },
];

export default function BookingSettings({ settings }) {
    const form = useForm({
        timezone: settings.timezone,
        days_ahead: settings.days_ahead,
        slot_duration: settings.slot_duration,
        daily_start: settings.daily_start,
        daily_end: settings.daily_end,
        weekdays: settings.weekdays || [1, 2, 3, 4, 5],
        buffer_minutes: settings.buffer_minutes ?? 0,
    });

    function toggleWeekday(value) {
        const current = form.data.weekdays || [];
        form.setData('weekdays', current.includes(value) ? current.filter((d) => d !== value) : [...current, value].sort());
    }

    function submit(e) {
        e.preventDefault();
        form.put('/admin/bookings/settings');
    }

    return (
        <AdminLayout title="Meeting Booking" subtitle="Configure availability for the public /book page.">
            <ResourceEditorShell
                title="Bookings"
                subtitle="Meeting scheduler"
                tabs={tabs}
                onSubmit={submit}
                processing={form.processing}
                statusLabel={`${form.data.weekdays?.length || 0} days · ${form.data.daily_start}–${form.data.daily_end}`}
            >
                {(section) => {
                    if (section.id === 'schedule') {
                        return (
                            <div className="cms-form-grid">
                                <FieldShell label="Timezone"><Input value={form.data.timezone} onChange={(e) => form.setData('timezone', e.target.value)} /></FieldShell>
                                <FieldShell label="Days ahead" hint="How far into the future clients can book.">
                                    <Input type="number" min="1" max="60" value={form.data.days_ahead} onChange={(e) => form.setData('days_ahead', e.target.value)} />
                                </FieldShell>
                                <FieldShell label="Slot duration (minutes)"><Input type="number" min="15" max="180" value={form.data.slot_duration} onChange={(e) => form.setData('slot_duration', e.target.value)} /></FieldShell>
                                <FieldShell label="Buffer between slots (minutes)"><Input type="number" min="0" max="120" value={form.data.buffer_minutes} onChange={(e) => form.setData('buffer_minutes', e.target.value)} /></FieldShell>
                                <FieldShell label="Daily start"><Input type="time" value={form.data.daily_start} onChange={(e) => form.setData('daily_start', e.target.value)} /></FieldShell>
                                <FieldShell label="Daily end"><Input type="time" value={form.data.daily_end} onChange={(e) => form.setData('daily_end', e.target.value)} /></FieldShell>
                            </div>
                        );
                    }

                    return (
                        <div className="admin-booking-weekdays">
                            {WEEKDAYS.map((day) => (
                                <Checkbox
                                    key={day.value}
                                    label={day.label}
                                    checked={(form.data.weekdays || []).includes(day.value)}
                                    onChange={() => toggleWeekday(day.value)}
                                />
                            ))}
                        </div>
                    );
                }}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
