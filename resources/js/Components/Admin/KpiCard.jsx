import { Link } from '../../app';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

function Sparkline({ series = [] }) {
    const max = Math.max(...series.map((row) => row.value), 1);
    const points = series.map((row, index) => {
        const x = series.length <= 1 ? 0 : (index / (series.length - 1)) * 100;
        const y = 100 - ((row.value / max) * 80 + 10);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="kpi-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={points} />
        </svg>
    );
}

export default function KpiCard({ label, value, change, href, series = [], formatValue }) {
    const displayValue = formatValue ? formatValue(value) : value;
    const positive = change >= 0;
    const TrendIcon = positive ? RiArrowUpSLine : RiArrowDownSLine;

    const content = (
        <>
            <div className="kpi-card-top">
                <span className="kpi-card-label">{label}</span>
                <strong className="kpi-card-value">{displayValue}</strong>
            </div>
            <Sparkline series={series} />
            <div className={`kpi-card-change ${positive ? 'is-up' : 'is-down'}`}>
                <TrendIcon />
                <span>{positive ? '+' : ''}{change}%</span>
                <small>vs previous period</small>
            </div>
        </>
    );

    return href
        ? <Link href={href} className="kpi-card">{content}</Link>
        : <div className="kpi-card">{content}</div>;
}
