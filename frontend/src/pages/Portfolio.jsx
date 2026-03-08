import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPortfolio } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Portfolio = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPortfolio()
            .then((res) => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" text="Loading portfolio..." />
        </div>
    );

    const { holdings = [], totalInvested = 0, totalCurrent = 0, totalPnl = 0, balance = 0 } = data || {};
    const pnlPercent = totalInvested > 0 ? ((totalPnl / totalInvested) * 100).toFixed(2) : '0.00';

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Portfolio</h1>
                <p className="text-gray-500 text-sm mt-1">Your investment summary</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Invested Amount', value: `₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, color: 'text-white' },
                    { label: 'Current Value', value: `₹${totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, color: 'text-white' },
                    { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}₹${Math.abs(totalPnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, color: totalPnl >= 0 ? 'text-profit' : 'text-loss' },
                    { label: 'Available Cash', value: `₹${balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, color: 'text-primary-500' },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                        {s.label === 'Total P&L' && (
                            <p className={`text-xs ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>{pnlPercent}% return</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Holdings Table */}
            <div className="card">
                <h2 className="font-bold text-base mb-4">Holdings ({holdings.length})</h2>
                {holdings.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">📊</div>
                        <p className="text-gray-500">No holdings yet</p>
                        <Link to="/market" className="btn-primary mt-4 inline-block text-sm py-2 px-5">Explore Market</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-white/5">
                                    <th className="text-left pb-3 font-medium">Stock</th>
                                    <th className="text-right pb-3 font-medium">Qty</th>
                                    <th className="text-right pb-3 font-medium">Avg Price</th>
                                    <th className="text-right pb-3 font-medium">Current</th>
                                    <th className="text-right pb-3 font-medium">Invested</th>
                                    <th className="text-right pb-3 font-medium">Value</th>
                                    <th className="text-right pb-3 font-medium">P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((h) => (
                                    <tr key={h.symbol} className="table-row">
                                        <td className="py-3">
                                            <Link to={`/stock/${h.symbol}`} className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                                                <div className="w-7 h-7 text-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-emerald-500 font-bold text-xs">{h.symbol.slice(0, 2)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{h.symbol}</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block">{h.companyName}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-3 text-right font-medium">{h.quantity}</td>
                                        <td className="py-3 text-right text-gray-400">₹{h.avgBuyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                        <td className="py-3 text-right font-medium">₹{h.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                        <td className="py-3 text-right text-gray-400">₹{h.invested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                        <td className="py-3 text-right font-bold">₹{h.current.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                        <td className="py-3 text-right">
                                            <div className={h.pnl >= 0 ? 'text-profit' : 'text-loss'}>
                                                <p className="font-semibold">{h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl).toFixed(2)}</p>
                                                <p className="text-xs">{h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent}%</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
