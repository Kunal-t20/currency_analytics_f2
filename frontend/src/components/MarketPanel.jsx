import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import "./MarketPanel.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

// Pick a consistent accent color based on the currency code
const colorFor = (cur) => {
    const palette = [
        "#00e676", "#00c6ff", "#a855f7", "#fbbf24",
        "#f472b6", "#34d399", "#60a5fa", "#fb923c"
    ];
    let hash = 0;
    for (const ch of cur) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
    return palette[hash % palette.length];
};

function MarketPanel({ from, to }) {
    const [rates, setRates] = useState({});
    const [chartData, setChartData] = useState(null);
    const [chartError, setChartError] = useState(false);
    const [liveRate, setLiveRate] = useState(null);
    const prevPairRef = useRef("");

    // Whenever the converter pair changes, reload chart + live rate
    useEffect(() => {
        const key = `${from}-${to}`;
        if (prevPairRef.current === key) return;
        prevPairRef.current = key;

        loadChart(from, to);
        loadLiveRate(from, to);
    }, [from, to]);

    // Also load the panel's base rate list (for the rate rows) on mount
    useEffect(() => {
        loadRates(from);
    }, [from]);

    const loadLiveRate = async (f, t) => {
        try {
            const res = await fetch(`https://api.frankfurter.app/latest?from=${f}&to=${t}`);
            const data = await res.json();
            setLiveRate(data.rates?.[t] ?? null);
        } catch { setLiveRate(null); }
    };

    const loadRates = async (base) => {
        try {
            const res = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=INR,EUR,GBP,JPY,AUD`);
            const data = await res.json();
            setRates(data.rates ?? {});
        } catch (e) { console.error(e); }
    };

    const loadChart = async (f, t) => {
        setChartData(null);
        setChartError(false);
        // same-currency edge case
        if (f === t) { setChartError(true); return; }
        try {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 30);
            const fmt = d => d.toISOString().split("T")[0];
            const res = await fetch(
                `https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?from=${f}&to=${t}`
            );
            const data = await res.json();
            if (!data.rates) throw new Error("no rates");
            const color = colorFor(t);
            const labels = Object.keys(data.rates).slice(-10);
            const values = labels.map(d => data.rates[d][t]);
            setChartData({
                labels,
                datasets: [{
                    label: `${f} → ${t}`,
                    data: values,
                    borderColor: color,
                    backgroundColor: color.replace(")", ",0.15)").replace("rgb", "rgba").replace("#", "rgba(").replace(/^rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2}),/, (_, r, g, b) =>
                        `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},`),
                    tension: 0.45,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: color,
                    borderWidth: 2,
                }]
            });
        } catch (e) {
            setChartError(true);
        }
    };

    const accentColor = colorFor(to);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(13,17,23,0.92)",
                borderColor: accentColor,
                borderWidth: 1,
                titleColor: "#fff",
                bodyColor: accentColor,
                padding: 10,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: { color: "rgba(255,255,255,0.04)" },
                ticks: { color: "rgba(255,255,255,0.4)", maxTicksLimit: 5, font: { size: 10 } }
            },
            y: {
                grid: { color: "rgba(255,255,255,0.06)" },
                ticks: { color: "rgba(255,255,255,0.4)", font: { size: 10 } }
            }
        }
    };

    const rateEntries = Object.entries(rates);

    return (
        <div className="card market-card">

            {/* Header */}
            <div className="card-header">
                <span className="card-icon">📈</span>
                <div>
                    <h2 className="card-title">Market Trends</h2>
                    <p className="card-subtitle">Live forex rates &amp; trend chart</p>
                </div>
            </div>

            {/* Dynamic pair pill */}
            <div className="active-pair-pill" style={{ "--pill-color": accentColor }}>
                <span className="pair-pill-label">Showing trend for</span>
                <span className="pair-pill-value">{from} → {to}</span>
                {liveRate && (
                    <span className="pair-pill-rate" style={{ color: accentColor }}>
                        1 {from} = {liveRate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}
                    </span>
                )}
            </div>

            {/* Chart area */}
            <div className="chart-wrap">
                {chartError
                    ? <p className="chart-error">⚠ Chart unavailable for {from} → {to}</p>
                    : chartData
                        ? <Line data={chartData} options={chartOptions} />
                        : <div className="chart-skeleton">
                            <span className="pulse-bar" />
                            <span className="pulse-bar" />
                            <span className="pulse-bar" />
                        </div>
                }
            </div>

            {/* Live rates (from base currency) */}
            <div className="rates-section">
                <h4 className="rates-title">
                    <span className="rates-dot" /> Live Rates ({from} Base)
                </h4>

                <div className="rates-list">
                    {rateEntries.length === 0
                        ? [1, 2, 3].map(i => (
                            <div key={i} className="rate-item skeleton-row"><span /><span /></div>
                        ))
                        : rateEntries.map(([cur, val]) => {
                            const isActive = cur === to;
                            const col = colorFor(cur);
                            return (
                                <div
                                    key={cur}
                                    className={`rate-item ${isActive ? "rate-item-active" : ""}`}
                                    style={isActive ? { "--row-color": col } : {}}
                                >
                                    <div className="rate-pair">
                                        <span className="rate-dot" style={{ background: col }} />
                                        <span className="rate-label">{from} → {cur}</span>
                                        {isActive && <span className="rate-selected-badge">selected</span>}
                                    </div>
                                    <span className="rate-value" style={{ color: col }}>
                                        {val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

        </div>
    );
}

export default MarketPanel;