<?php

namespace App\Services;

use App\Models\QuoteType;

class QuoteCalculatorService
{
    public function calculate(QuoteType $type, array $selections): array
    {
        $total = (int) $type->base_price;
        $breakdown = [
            ['label' => 'Base package', 'amount' => (int) $type->base_price],
        ];

        foreach ($type->options ?? [] as $option) {
            $key = $option['key'] ?? null;
            if (! $key) {
                continue;
            }

            $value = $selections[$key] ?? null;
            $amount = 0;
            $label = $option['label'] ?? $key;

            if (($option['type'] ?? '') === 'toggle' && $this->isTruthy($value)) {
                $amount = (int) ($option['price'] ?? 0);
            }

            if (($option['type'] ?? '') === 'number') {
                $qty = max(0, (int) $value);
                $amount = $qty * (int) ($option['unit_price'] ?? 0);
                $label = "{$label} (×{$qty})";
            }

            if (($option['type'] ?? '') === 'select') {
                foreach ($option['choices'] ?? [] as $choice) {
                    if (($choice['value'] ?? null) === $value) {
                        $amount = (int) ($choice['price'] ?? 0);
                        $label = $choice['label'] ?? $label;
                        break;
                    }
                }
            }

            if ($amount > 0) {
                $breakdown[] = ['label' => $label, 'amount' => $amount];
                $total += $amount;
            }
        }

        return [
            'total' => $total,
            'currency' => $type->currency ?? 'BDT',
            'breakdown' => $breakdown,
        ];
    }

    public function formatMoney(int $amount, string $currency = 'BDT'): string
    {
        return $currency.' '.number_format($amount);
    }

    private function isTruthy(mixed $value): bool
    {
        return in_array($value, [true, 1, '1', 'true', 'on', 'yes'], true);
    }
}
