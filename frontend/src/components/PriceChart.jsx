import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PriceChart = ({ history = [], symbol = '' }) => {
    const labels = history.map((h) => h.date);
    const prices = history.map((h) => h.price);
    const isPositive = prices.length > 1 ? prices[prices.length - 1] >= prices[0] : true;
    const lineColor = isPositive ? '#00c278' : '#eb5757';

    const data = {
        labels,
        datasets: [
            {
                label: symbol,
                data: prices,
                borderColor: lineColor,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return 'transparent';
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, isPositive ? 'rgba(0,194,120,0.25)' : 'rgba(235,87,87,0.25)');
                    gradient.addColorStop(1, 'rgba(0,0,0,0)');
                    return gradient;
                },
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: lineColor,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e2130',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#9ca3af',
                bodyColor: '#ffffff',
                bodyFont: { weight: 'bold', size: 14 },
                callbacks: {
                    label: (ctx) => `₹${ctx.parsed.y.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
                },
                padding: 10,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: {
                    color: '#6b7280',
                    maxTicksLimit: 8,
                    font: { size: 11 },
                },
                border: { display: false },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: {
                    color: '#6b7280',
                    callback: (val) => `₹${val.toLocaleString('en-IN')}`,
                    font: { size: 11 },
                },
                border: { display: false },
                position: 'right',
            },
        },
        interaction: { mode: 'index', intersect: false },
    };

    return (
        <div style={{ height: '300px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default PriceChart;
