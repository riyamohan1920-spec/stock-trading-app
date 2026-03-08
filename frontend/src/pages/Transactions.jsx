import { useEffect, useState } from 'react';
import { getTransactionHistory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL | BUY | SELL

    useEffect(() => {
        getTransactionHistory()
            .then((res) => setTransactions(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'ALL' ? transactions : transactions.filter((t) => t.type === filter);

    const totals = {
        buy: transactions.filter((t) => t.type === 'BUY').reduce((s, t) => s + t.total, 0),
        sell: transactions.filter((t) => t.type === 'SELL').reduce((s, t) => s + t.total, 0),
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" text="Loading history..." />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Transaction History</h1>
                <p className="text-gray-500 text-sm mt-1">{transactions.length} total transactions</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="stat-card">
                    <p className="text-xs text-gray-500">Total Transactions</p>
                    <p className="text-xl font-bold">{transactions.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500">Total Bought</p>
                    <p className="text-xl font-bold text-loss">₹{totals.buy.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500">Total Sold</p>
                    <p className="text-xl font-bold text-profit">₹{totals.sell.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="card">
                {/* Filter tabs */}
                <div className="flex gap-2 mb-5">
                    {['ALL', 'BUY', 'SELL'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'text-red-500text-red-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'
                                }`}
                        >
                            {f === 'ALL' ? 'All' : f === 'BUY' ? '🟢 Buy' : '🔴 Sell'}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No {filter === 'ALL' ? '' : filter.toLowerCase() + ' '}transactions yet</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-white/5">
                                    <th className="text-left pb-3 font-medium">Stock</th>
                                    <th className="text-center pb-3 font-medium">Type</th>
                                    <th className="text-right pb-3 font-medium">Qty</th>
                                    <th className="text-right pb-3 font-medium">Price</th>
                                    <th className="text-right pb-3 font-medium">Total</th>
                                    <th className="text-right pb-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((t) => (
                                    <tr key={t._id} className="table-row">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 text-red-500/15 rounded-lg flex items-center justify-center">
                                                    <span className="text-red-500 font-bold text-xs">{t.symbol.slice(0, 2)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{t.symbol}</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block truncate max-w-[120px]">{t.companyName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${t.type === 'BUY' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right font-medium">{t.quantity}</td>
                                        <td className="py-3 text-right text-gray-400">
                                            ₹{t.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className={`py-3 text-right font-bold ${t.type === 'BUY' ? 'text-loss' : 'text-profit'}`}>
                                            {t.type === 'BUY' ? '-' : '+'}₹{t.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-3 text-right text-gray-500 text-xs">
                                            {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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

export default Transactions;
