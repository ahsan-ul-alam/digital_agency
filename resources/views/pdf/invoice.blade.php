<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #111; font-size: 12px; line-height: 1.5; }
        h1 { font-size: 22px; margin: 0 0 4px; }
        h2 { font-size: 14px; margin: 24px 0 8px; }
        .muted { color: #666; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f3f4f6; }
        .totals { margin-top: 12px; width: 280px; margin-left: auto; }
        .totals td { border: none; padding: 4px 0; }
        .totals .grand td { font-weight: bold; font-size: 14px; border-top: 1px solid #111; padding-top: 8px; }
        .status { display:inline-block; padding:4px 10px; border-radius:999px; background:#eef2ff; font-weight:bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $site['name'] }}</h1>
        <div class="muted">{{ $site['tagline'] }}</div>
        @if($site['email'])<div class="muted">{{ $site['email'] }} @if($site['phone']) · {{ $site['phone'] }} @endif</div>@endif
    </div>

    <h1>Invoice</h1>
    <div class="muted">{{ $invoice->invoice_number }} · {{ $invoice->created_at?->format('M j, Y') }}</div>
    <p class="status">{{ strtoupper($invoice->status) }}</p>

    <h2>Bill to</h2>
    <strong>{{ $invoice->client_name }}</strong><br>
    {{ $invoice->client_email }}
    @if($invoice->client_company)<br>{{ $invoice->client_company }}@endif
    @if($invoice->due_date)<p><strong>Due date:</strong> {{ $invoice->due_date->format('M j, Y') }}</p>@endif

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->line_items as $item)
            <tr>
                <td>{{ $item['description'] }}</td>
                <td>{{ $item['quantity'] }}</td>
                <td>BDT {{ number_format($item['unit_price']) }}</td>
                <td>BDT {{ number_format($item['total']) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Subtotal</td><td style="text-align:right">BDT {{ number_format($invoice->subtotal) }}</td></tr>
        @if($invoice->tax_amount > 0)
        <tr><td>Tax ({{ $invoice->tax_percent }}%)</td><td style="text-align:right">BDT {{ number_format($invoice->tax_amount) }}</td></tr>
        @endif
        <tr class="grand"><td>Amount due</td><td style="text-align:right">BDT {{ number_format($invoice->total) }}</td></tr>
    </table>

    @if($invoice->notes)
    <h2>Notes</h2>
    <p>{!! nl2br(e($invoice->notes)) !!}</p>
    @endif
</body>
</html>
