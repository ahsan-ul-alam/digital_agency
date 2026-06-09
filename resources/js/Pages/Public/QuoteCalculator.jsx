import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import { Checkbox, Input, Textarea } from '../../Components/Form';
import { useForm } from '../../app';
import { RiCalculatorLine } from 'react-icons/ri';

function formatMoney(amount, currency = 'BDT') {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

function OptionField({ option, value, onChange }) {
    if (option.type === 'toggle') {
        return (
            <Checkbox
                label={`${option.label}${option.price ? ` (+${formatMoney(option.price)})` : ''}`}
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
            />
        );
    }

    if (option.type === 'number') {
        return (
            <label className="grid gap-2">
                <span className="text-sm font-semibold text-muted">
                    {option.label} {option.unit_price ? `(+${formatMoney(option.unit_price)} each)` : ''}
                </span>
                <Input
                    type="number"
                    min={option.min ?? 0}
                    max={option.max ?? 999}
                    value={value ?? option.default ?? 0}
                    onChange={(e) => onChange(e.target.value)}
                />
            </label>
        );
    }

    if (option.type === 'select') {
        return (
            <label className="grid gap-2">
                <span className="text-sm font-semibold text-muted">{option.label}</span>
                <select
                    className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm"
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {(option.choices || []).map((choice) => (
                        <option key={choice.value} value={choice.value}>
                            {choice.label}{choice.price ? ` (+${formatMoney(choice.price)})` : ''}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    return null;
}

export default function QuoteCalculator({ types, seo }) {
    const [selectedId, setSelectedId] = useState(types[0]?.id ?? null);
    const [selections, setSelections] = useState({});
    const [estimate, setEstimate] = useState(null);
    const form = useForm({
        quote_type_id: types[0]?.id ?? '',
        selections: {},
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
    });

    const selectedType = useMemo(() => types.find((t) => t.id === selectedId), [types, selectedId]);

    useEffect(() => {
        if (!selectedType) return;
        const defaults = {};
        (selectedType.options || []).forEach((option) => {
            if (option.type === 'toggle') defaults[option.key] = false;
            if (option.type === 'number') defaults[option.key] = option.default ?? 0;
            if (option.type === 'select') defaults[option.key] = option.choices?.[0]?.value ?? '';
        });
        setSelections(defaults);
        form.setData('quote_type_id', selectedType.id);
        form.setData('selections', defaults);
    }, [selectedType?.id]);

    useEffect(() => {
        if (!selectedType) return;
        const timer = setTimeout(() => {
            axios.post('/quote/estimate', {
                quote_type_id: selectedType.id,
                selections,
            }).then((res) => setEstimate(res.data)).catch(() => setEstimate(null));
        }, 250);
        return () => clearTimeout(timer);
    }, [selectedType?.id, selections]);

    function selectType(id) {
        setSelectedId(id);
    }

    function updateSelection(key, value) {
        const next = { ...selections, [key]: value };
        setSelections(next);
        form.setData('selections', next);
    }

    function submit(e) {
        e.preventDefault();
        form.post('/quote', { preserveScroll: true, onSuccess: () => form.reset('name', 'email', 'phone', 'company', 'message') });
    }

    return (
        <PublicLayout seo={seo}>
            <Section pageHeading eyebrow="Quote Calculator" title="Estimate Your Project Budget" subtitle="Choose a project type, configure options, and get an instant estimate. Submit your details and our team will prepare a tailored proposal.">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {types.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => selectType(type.id)}
                                    className={`quote-type-card${selectedId === type.id ? ' is-active' : ''}`}
                                >
                                    <strong>{type.name}</strong>
                                    <p className="mt-1 text-sm text-muted">{type.description}</p>
                                    <p className="mt-2 text-sm font-semibold text-primary">From {formatMoney(type.base_price, type.currency)}</p>
                                </button>
                            ))}
                        </div>

                        {selectedType && (
                            <div className="mt-6 grid gap-4">
                                <h3 className="text-lg font-bold">Configure options</h3>
                                {(selectedType.options || []).map((option) => (
                                    <OptionField
                                        key={option.key}
                                        option={option}
                                        value={selections[option.key]}
                                        onChange={(value) => updateSelection(option.key, value)}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>

                    <div className="grid gap-6">
                        <Card className="quote-estimate-card">
                            <div className="flex items-center gap-3">
                                <RiCalculatorLine className="text-3xl text-primary" />
                                <div>
                                    <p className="text-sm text-muted">Estimated investment</p>
                                    <p className="text-3xl font-bold">
                                        {estimate ? formatMoney(estimate.total, estimate.currency) : '—'}
                                    </p>
                                </div>
                            </div>
                            {estimate?.breakdown?.length > 0 && (
                                <div className="mt-5 grid gap-2 text-sm">
                                    {estimate.breakdown.map((row) => (
                                        <div key={row.label} className="flex justify-between gap-3 text-muted">
                                            <span>{row.label}</span>
                                            <span>{formatMoney(row.amount, estimate.currency)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        <Card>
                            <h3 className="text-lg font-bold">Request detailed proposal</h3>
                            <p className="mt-2 text-sm text-muted">We will review your estimate and contact you within 24 hours.</p>
                            <form onSubmit={submit} className="mt-5 grid gap-4">
                                <Input required placeholder="Name *" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                <Input required type="email" placeholder="Email *" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                                <Input placeholder="Phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                                <Input placeholder="Company" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} />
                                <Textarea placeholder="Additional requirements" value={form.data.message} onChange={(e) => form.setData('message', e.target.value)} />
                                <button disabled={form.processing} className="btn-primary rounded-full px-6 py-3 font-bold disabled:opacity-60">
                                    Send estimate request
                                </button>
                            </form>
                        </Card>
                    </div>
                </div>
            </Section>
        </PublicLayout>
    );
}
