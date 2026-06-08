import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import { Input, Select, Textarea } from '../../Components/Form';
import { useForm, usePage } from '../../app';

export default function Contact({ settings, services }) {
    const { flash } = usePage().props;
    const form = useForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' });

    function submit(e) {
        e.preventDefault();
        form.post('/contact', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    return (
        <PublicLayout settings={settings} title="Contact">
            <Section eyebrow="Contact" title="Tell Us What You Want To Build" subtitle="Your submission is stored in the admin dashboard and our team will respond within 24 hours.">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card>
                        {flash?.success && <p className="success-banner mb-5 rounded-2xl p-4">{flash.success}</p>}
                        <form onSubmit={submit} className="grid gap-4">
                            <Input placeholder="Name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <Input type="email" placeholder="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                            <Input placeholder="Phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                            <Input placeholder="Company" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} />
                            <Input placeholder="Budget" value={form.data.budget} onChange={(e) => form.setData('budget', e.target.value)} />
                            <Select value={form.data.service} onChange={(e) => form.setData('service', e.target.value)}>
                                <option value="">Select a service</option>
                                {services.map((service) => <option key={service} value={service}>{service}</option>)}
                            </Select>
                            <Textarea placeholder="Project message" value={form.data.message} onChange={(e) => form.setData('message', e.target.value)} />
                            <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">Send Inquiry</button>
                        </form>
                    </Card>
                    <Card>
                        <h3 className="text-2xl font-bold">Office Information</h3>
                        <div className="mt-5 grid gap-3 text-muted">
                            <span>{settings.contact?.email}</span>
                            <span>{settings.contact?.phone}</span>
                            <span>{settings.contact?.address}</span>
                            <a href={settings.contact?.map} className="text-primary">Open Google Map</a>
                        </div>
                    </Card>
                </div>
            </Section>
        </PublicLayout>
    );
}
