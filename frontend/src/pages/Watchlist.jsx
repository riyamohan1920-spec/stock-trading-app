import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Watchlist = () => {
    const { user, updateUser } = useAuth();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWatchlist()
            .then((res) => setStocks(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (symbol) => {
        try {
            await removeFromWatchlist(symbol);
            setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
            updateUser({ watchlist: (user?.watchlist || []).filter((s) => s !== symbol) });
            toast.success(`Removed ${symbol} from watchlist`);
        } catch {
            toast.error('Failed to remove');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" text="Loading watchlist..." />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Watchlist</h1>
                    <p className="text-gray-500 text-sm mt-1">{stocks.length} stocks tracked</p>
                </div>
                <Link to="/market" className="btn-secondary text-sm py-2 px-5">+ Add Stocks</Link>
            </div>

            {stocks.length === 0 ? (
                <div className="card text-center py-16">
                    <div className="text-5xl mb-4">⭐</div>
                    <p className="text-gray-400 text-lg font-semibold mb-2">Your watchlist is empty</p>
                    <p className="text-gray-600 text-sm mb-6">Add stocks from the market to track them here</p>
                    <Link to="/market" className="btn-primary inline-block text-sm py-2.5 px-6">Explore Market</Link>
                </div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b border-white/5">
                                <th className="text-left pb-3 font-medium">Stock</th>
                                <th className="text-right pb-3 font-medium">Price</th>
                                <th className="text-right pb-3 font-medium">Change</th>
                                <th className="text-right pb-3 font-medium">Change %</th>
                                <th className="text-right pb-3 font-medium">Volume</th>
                                <th className="text-right pb-3 font-medium">Sector</th>
                                <th className="text-right pb-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((s) => {
                                const isPos = s.change >= 0;
                                return (
                                    <tr key={s.symbol} className="table-row">
                                        <td className="py-3">
                                            <Link to={`/stock/${s.symbol}`} className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                                                <div className="w-8 h-8 text-red-500/15 rounded-lg flex items-center justify-center">
                                                    <span className="text-red-500 font-bold text-xs">{s.symbol.slice(0, 2)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{s.symbol}</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block truncate max-w-[120px]">{s.companyName}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-3 text-right font-bold">₹{s.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                        <td className={`py-3 text-right ${isPos ? 'text-profit' : 'text-loss'}`}>
                                            {isPos ? '+' : ''}{s.change?.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-right">
                                            <span className={`badge-${isPos ? 'profit' : 'loss'}`}>
                                                {isPos ? '+' : ''}{s.changePercent?.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="py-3 text-right text-gray-500">{(s.volume / 1000).toFixed(0)}K</td>
                                        <td className="py-3 text-right">
                                            <span className="text-xs bg-dark-300 text-gray-400 px-2 py-0.5 rounded-md">{s.sector}</span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => handleRemove(s.symbol)}
                                                className="text-gray-600 hover:text-loss transition-colors ml-3"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Watchlist;
