<?php

namespace App\Support;

class LineItemCalculator
{
    public static function normalize(array $items): array
    {
        return collect($items)->map(function ($item) {
            $qty = max(1, (int) ($item['quantity'] ?? 1));
            $unit = max(0, (int) ($item['unit_price'] ?? 0));

            return [
                'description' => $item['description'] ?? 'Item',
                'quantity' => $qty,
                'unit_price' => $unit,
                'total' => $qty * $unit,
            ];
        })->values()->all();
    }

    public static function totals(array $items, float $taxPercent = 0): array
    {
        $lineItems = self::normalize($items);
        $subtotal = collect($lineItems)->sum('total');
        $taxAmount = (int) round($subtotal * ($taxPercent / 100));
        $total = $subtotal + $taxAmount;

        return compact('lineItems', 'subtotal', 'taxAmount', 'total');
    }
}
