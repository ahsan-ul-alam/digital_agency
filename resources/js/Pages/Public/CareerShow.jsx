import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import { Input, Textarea } from '../../Components/Form';
import { Link, useForm } from '../../app';

export default function CareerShow({ opening, seo }) {
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        portfolio_url: '',
        message: '',
    });

    function submit(e) {
        e.preventDefault();
        form.post(`/careers/${opening.slug}/apply`, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <PublicLayout seo={seo}>
            <Section pageHeading eyebrow="Careers" title={opening.title} subtitle={`${opening.department || 'Role'} · ${opening.location || 'Flexible'} · ${opening.employment_type_label}`}>
                <div className="career-detail-grid">
                    <Card>
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: opening.description }} />
                        {opening.requirements?.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold">Requirements</h3>
                                <ul className="mt-3 grid gap-2 text-sm text-muted">
                                    {opening.requirements.map((item) => <li key={item}>• {item}</li>)}
                                </ul>
                            </div>
                        )}
                        <Link href="/careers" className="mt-6 inline-block text-sm font-semibold text-primary">← All openings</Link>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold">Apply for this role</h3>
                        <p className="mt-2 text-sm text-muted">Tell us why you are a fit. Applications flow into our CRM pipeline.</p>
                        <form onSubmit={submit} className="mt-5 grid gap-4">
                            <Input required placeholder="Name *" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <Input required type="email" placeholder="Email *" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                            <Input placeholder="Phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                            <Input placeholder="Current company" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} />
                            <Input placeholder="Portfolio or LinkedIn URL" value={form.data.portfolio_url} onChange={(e) => form.setData('portfolio_url', e.target.value)} />
                            <Textarea required placeholder="Cover letter / why you want this role *" value={form.data.message} onChange={(e) => form.setData('message', e.target.value)} rows={6} />
                            <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">Submit application</button>
                        </form>
                    </Card>
                </div>
            </Section>
        </PublicLayout>
    );
}
