<?php

namespace App\Services;

use App\Models\AnalyticsEvent;
use App\Models\Booking;
use App\Models\InvoicePayment;
use App\Models\Lead;
use App\Models\Proposal;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class AnalyticsService
{
    public function record(string $event, ?string $path = null, ?string $label = null, array $meta = []): void
    {
        AnalyticsEvent::create([
            'event' => $event,
            'path' => $path,
            'label' => $label,
            'meta' => $meta,
            'occurred_at' => now(),
        ]);
    }

    public function dailySeries(string $event, int $days = 14): array
    {
        $start = now()->subDays($days - 1)->startOfDay();
        $counts = AnalyticsEvent::query()
            ->where('event', $event)
            ->where('occurred_at', '>=', $start)
            ->selectRaw('DATE(occurred_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($start, $counts) {
                $day = $start->copy()->addDays($offset);
                $key = $day->toDateString();

                return [
                    'label' => $day->format('M j'),
                    'value' => (int) ($counts[$key] ?? 0),
                ];
            })
            ->all();
    }

    public function leadsByDay(int $days = 14): array
    {
        $start = now()->subDays($days - 1)->startOfDay();
        $counts = Lead::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($start, $counts) {
                $day = $start->copy()->addDays($offset);
                $key = $day->toDateString();

                return [
                    'label' => $day->format('M j'),
                    'value' => (int) ($counts[$key] ?? 0),
                ];
            })
            ->all();
    }

    public function topPages(int $limit = 8, int $days = 30): Collection
    {
        return AnalyticsEvent::query()
            ->where('event', 'page_view')
            ->where('occurred_at', '>=', now()->subDays($days))
            ->whereNotNull('path')
            ->selectRaw('path, COUNT(*) as views')
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'path' => $row->path,
                'views' => (int) $row->views,
            ]);
    }

    public function dashboardSnapshot(): array
    {
        return [
            'page_views_today' => AnalyticsEvent::where('event', 'page_view')
                ->where('occurred_at', '>=', now()->startOfDay())
                ->count(),
            'page_view_trend' => $this->dailySeries('page_view', 14),
            'lead_trend' => $this->leadsByDay(14),
            'top_pages' => $this->topPages()->all(),
            'kpis' => [
                $this->kpiFromTrend('Visitors', 'page_view', '/admin', 7),
                $this->kpiFromLeads(),
                $this->kpiFromRevenue(),
                $this->kpiFromCount('Bookings', Booking::query(), '/admin/bookings', 7),
            ],
        ];
    }

    public function kpiFromTrend(string $label, string $event, string $href, int $days = 7): array
    {
        $current = $this->countBetween(
            AnalyticsEvent::query()->where('event', $event),
            'occurred_at',
            now()->subDays($days),
            now()
        );
        $previous = $this->countBetween(
            AnalyticsEvent::query()->where('event', $event),
            'occurred_at',
            now()->subDays($days * 2),
            now()->subDays($days)
        );

        return [
            'label' => $label,
            'value' => $current,
            'change' => $this->growthPercent($current, $previous),
            'href' => $href,
            'series' => $this->dailySeries($event, 14),
        ];
    }

    public function kpiFromLeads(int $days = 7): array
    {
        $current = $this->countBetween(Lead::query(), 'created_at', now()->subDays($days), now());
        $previous = $this->countBetween(Lead::query(), 'created_at', now()->subDays($days * 2), now()->subDays($days));

        return [
            'label' => 'Leads',
            'value' => $current,
            'change' => $this->growthPercent($current, $previous),
            'href' => '/admin/leads',
            'series' => $this->leadsByDay(14),
        ];
    }

    public function kpiFromRevenue(int $days = 7): array
    {
        $current = (int) $this->sumBetween(InvoicePayment::query(), 'paid_at', now()->subDays($days), now(), 'amount');
        $previous = (int) $this->sumBetween(InvoicePayment::query(), 'paid_at', now()->subDays($days * 2), now()->subDays($days), 'amount');

        return [
            'label' => 'Revenue',
            'value' => $current,
            'change' => $this->growthPercent($current, $previous),
            'href' => '/admin/invoices',
            'series' => $this->paymentsByDay(14),
            'format' => 'currency',
        ];
    }

    public function kpiFromCount(string $label, Builder $query, string $href, int $days = 7): array
    {
        $current = $this->countBetween($query, 'created_at', now()->subDays($days), now());
        $previous = $this->countBetween(clone $query, 'created_at', now()->subDays($days * 2), now()->subDays($days));

        return [
            'label' => $label,
            'value' => $current,
            'change' => $this->growthPercent($current, $previous),
            'href' => $href,
            'series' => [],
        ];
    }

    public function paymentsByDay(int $days = 14): array
    {
        $start = now()->subDays($days - 1)->startOfDay();
        $totals = InvoicePayment::query()
            ->where('paid_at', '>=', $start)
            ->selectRaw('DATE(paid_at) as day, SUM(amount) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($start, $totals) {
                $day = $start->copy()->addDays($offset);
                $key = $day->toDateString();

                return [
                    'label' => $day->format('M j'),
                    'value' => (int) ($totals[$key] ?? 0),
                ];
            })
            ->all();
    }

    private function countBetween(Builder $query, string $column, Carbon $from, Carbon $to): int
    {
        return (clone $query)->whereBetween($column, [$from, $to])->count();
    }

    private function sumBetween(Builder $query, string $column, Carbon $from, Carbon $to, string $sumColumn): int
    {
        return (int) (clone $query)->whereBetween($column, [$from, $to])->sum($sumColumn);
    }

    private function growthPercent(int|float $current, int|float $previous): int
    {
        if ($previous <= 0) {
            return $current > 0 ? 100 : 0;
        }

        return (int) round((($current - $previous) / $previous) * 100);
    }
}
