import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import { Checkbox, Input } from '../../Components/Form';
import { useForm } from '../../app';

export default function Login() {
    const form = useForm({ email: 'admin@arsoftbd.com', password: 'password', remember: true });

    function submit(e) {
        e.preventDefault();
        form.post('/login');
    }

    return (
        <PublicLayout title="Admin Login">
            <Section eyebrow="Admin" title="Sign in to manage AR Soft BD">
                <Card className="mx-auto max-w-xl">
                    <form onSubmit={submit} className="grid gap-4">
                        <label className="grid gap-2">
                            <span className="text-sm text-muted">Email</span>
                            <Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                            {form.errors.email && <span className="text-sm text-rose-300">{form.errors.email}</span>}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm text-muted">Password</span>
                            <Input type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
                        </label>
                        <Checkbox
                            label="Remember me"
                            checked={form.data.remember}
                            onChange={(e) => form.setData('remember', e.target.checked)}
                        />
                        <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">Login</button>
                    </form>
                </Card>
            </Section>
        </PublicLayout>
    );
}
