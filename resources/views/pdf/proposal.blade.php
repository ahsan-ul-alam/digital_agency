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
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $site['name'] }}</h1>
        <div class="muted">{{ $site['tagline'] }}</div>
        @if($site['email'])<div class="muted">{{ $site['email'] }} @if($site['phone']) · {{ $site['phone'] }} @endif</div>@endif
    </div>

    <h1>Proposal</h1>
    <div class="muted">{{ $proposal->number }} · {{ $proposal->created_at?->format('M j, Y') }}</div>

    <h2>Prepared for</h2>
    <strong>{{ $proposal->client_name }}</strong><br>
    {{ $proposal->client_email }}
    @if($proposal->client_company)<br>{{ $proposal->client_company }}@endif

    <h2>{{ $proposal->title }}</h2>
    @if($proposal->timeline)<p><strong>Timeline:</strong> {{ $proposal->timeline }}</p>@endif
    @if($proposal->valid_until)<p><strong>Valid until:</strong> {{ $proposal->valid_until->format('M j, Y') }}</p>@endif

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
            @foreach($proposal->line_items as $item)
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
        <tr><td>Subtotal</td><td style="text-align:right">BDT {{ number_format($proposal->subtotal) }}</td></tr>
        @if($proposal->tax_amount > 0)
        <tr><td>Tax ({{ $proposal->tax_percent }}%)</td><td style="text-align:right">BDT {{ number_format($proposal->tax_amount) }}</td></tr>
        @endif
        <tr class="grand"><td>Total</td><td style="text-align:right">BDT {{ number_format($proposal->total) }}</td></tr>
    </table>

    @if($proposal->notes)
    <h2>Notes</h2>
    <p>{!! nl2br(e($proposal->notes)) !!}</p>
    @endif
</body>
</html>
