import { Input } from '../Form';

export function calcLineItems(items, taxPercent = 0) {
    const normalized = items.map((item) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const unit = Math.max(0, Number(item.unit_price) || 0);
        return { ...item, quantity: qty, unit_price: unit, total: qty * unit };
    });
    const subtotal = normalized.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = Math.round(subtotal * (Number(taxPercent) / 100));
    return { lineItems: normalized, subtotal, taxAmount, total: subtotal + taxAmount };
}

export default function LineItemsEditor({ items, onChange, taxPercent = 0, currency = 'BDT' }) {
    const totals = calcLineItems(items, taxPercent);

    function update(index, key, value) {
        onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
    }

    function addRow() {
        onChange([...items, { description: '', quantity: 1, unit_price: 0 }]);
    }

    function removeRow(index) {
        if (items.length === 1) return;
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="admin-line-items">
            <div className="admin-line-items-head">
                <span>Description</span>
                <span>Qty</span>
                <span>Unit price</span>
                <span>Total</span>
                <span />
            </div>
            {items.map((item, index) => {
                const rowTotal = Math.max(1, Number(item.quantity) || 1) * Math.max(0, Number(item.unit_price) || 0);
                return (
                    <div key={index} className="admin-line-items-row">
                        <Input value={item.description} onChange={(e) => update(index, 'description', e.target.value)} placeholder="Service or deliverable" />
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => update(index, 'quantity', e.target.value)} />
                        <Input type="number" min="0" value={item.unit_price} onChange={(e) => update(index, 'unit_price', e.target.value)} />
                        <span className="admin-line-items-total">{currency} {rowTotal.toLocaleString()}</span>
                        <button type="button" className="admin-line-items-remove" onClick={() => removeRow(index)}>×</button>
                    </div>
                );
            })}
            <button type="button" className="admin-line-items-add" onClick={addRow}>+ Add line item</button>
            <div className="admin-line-items-summary">
                <p>Subtotal: <strong>{currency} {totals.subtotal.toLocaleString()}</strong></p>
                {totals.taxAmount > 0 && <p>Tax: <strong>{currency} {totals.taxAmount.toLocaleString()}</strong></p>}
                <p className="admin-line-items-grand">Total: <strong>{currency} {totals.total.toLocaleString()}</strong></p>
            </div>
        </div>
    );
}
