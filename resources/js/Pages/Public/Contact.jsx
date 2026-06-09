import PublicLayout from '../../Layouts/PublicLayout';
import { FaqAccordion } from '../../Components/Public/Journey/HomeSections';
import { PageHero } from '../../Components/Public/Journey/PageSections';
import { Input, Select, Textarea } from '../../Components/Form';
import { Link, useForm } from '../../app';
import {
    RiCalendarLine,
    RiFileList3Line,
    RiMailLine,
    RiMapPinLine,
    RiPhoneLine,
    RiTimeLine,
} from 'react-icons/ri';

export default function Contact({ settings, seo, services, faqs = [] }) {
    const form = useForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' });
    const contact = settings.contact || {};

    function submit(e) {
        e.preventDefault();
        form.post('/contact', { preserveScroll: true, onSuccess: () => form.reset() });
    }

    return (
        <PublicLayout settings={settings} seo={seo}>
            <PageHero
                eyebrow="Let's talk"
                title="Tell us the business problem — we'll design the software"
                lead="Consultation booking, project inquiries and direct contact — structured for serious projects."
            />

            <section className="j-section">
                <div className="j-section-inner">
                    <div className="j-contact-options md:grid md:grid-cols-3 md:gap-4">
                        <Link href="/book" className="j-contact-option">
                            <RiCalendarLine className="text-xl text-primary" />
                            <strong>Book consultation</strong>
                            <span>Schedule a free strategy call with our team.</span>
                        </Link>
                        <Link href="/quote" className="j-contact-option">
                            <RiFileList3Line className="text-xl text-primary" />
                            <strong>Request proposal</strong>
                            <span>Get a scoped estimate for your software project.</span>
                        </Link>
                        <a href={`mailto:${contact.email}`} className="j-contact-option">
                            <RiMailLine className="text-xl text-primary" />
                            <strong>Quick contact</strong>
                            <span>Email us directly for urgent inquiries.</span>
                        </a>
                    </div>

                    <div className="j-contact-grid">
                        <div className="glass rounded-[1.5rem] p-6 md:p-8">
                            <h2 className="text-2xl font-bold">Project inquiry</h2>
                            <p className="mt-2 text-sm text-muted">We respond within 24 business hours.</p>
                            <form onSubmit={submit} className="mt-6 grid gap-4">
                                <Input required placeholder="Full name *" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                <Input required type="email" placeholder="Work email *" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input placeholder="Phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                                    <Input placeholder="Company" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Select value={form.data.service} onChange={(e) => form.setData('service', e.target.value)}>
                                        <option value="">Service needed</option>
                                        {services.map((service) => <option key={service} value={service}>{service}</option>)}
                                    </Select>
                                    <Input placeholder="Budget range" value={form.data.budget} onChange={(e) => form.setData('budget', e.target.value)} />
                                </div>
                                <Textarea required placeholder="Describe the business challenge and desired outcome *" value={form.data.message} onChange={(e) => form.setData('message', e.target.value)} />
                                <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">Submit inquiry</button>
                            </form>
                        </div>

                        <div className="grid gap-4">
                            <div className="j-contact-promise">
                                <RiTimeLine className="text-xl text-primary" />
                                <strong>Response time promise</strong>
                                <p className="text-sm text-muted">Every inquiry receives a human response within one business day. Complex projects get a follow-up call within 48 hours.</p>
                            </div>
                            <div className="glass rounded-[1.25rem] p-6">
                                <h3 className="font-bold">Office information</h3>
                                <div className="mt-4 grid gap-3 text-sm text-muted">
                                    {contact.email && <span className="flex items-center gap-2"><RiMailLine className="text-primary" />{contact.email}</span>}
                                    {contact.phone && <span className="flex items-center gap-2"><RiPhoneLine className="text-primary" />{contact.phone}</span>}
                                    {contact.address && <span className="flex items-start gap-2"><RiMapPinLine className="mt-0.5 text-primary" />{contact.address}</span>}
                                    {contact.map && (
                                        <a href={contact.map} target="_blank" rel="noreferrer" className="text-primary font-semibold">Open in Google Maps →</a>
                                    )}
                                </div>
                            </div>
                            {contact.map_embed && (
                                <div className="overflow-hidden rounded-[1.25rem] border border-white/10">
                                    <iframe title="Office location" src={contact.map_embed} className="h-48 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {faqs.length > 0 && <FaqAccordion faqs={faqs} />}
        </PublicLayout>
    );
}
