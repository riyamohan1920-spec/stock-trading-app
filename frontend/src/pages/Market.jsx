import { useState } from 'react';
import { useStocks } from '../context/StockContext';
import { useAuth } from '../context/AuthContext';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { addToWatchlist, removeFromWatchlist } from '../services/api';
import toast from 'react-hot-toast';

const SECTORS = ['All', 'Technology', 'Banking', 'Finance', 'Energy', 'Auto', 'Pharma', 'FMCG', 'Infrastructure', 'Utilities', 'Consumer'];

const Market = () => {
    const { stocks, loading } = useStocks();
    const { user, updateUser } = useAuth();
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('All');
    const [sort, setSort] = useState('name');

    const watchlist = user?.watchlist || [];

    const filtered = stocks
        .filter((s) =>
            (sector === 'All' || s.sector === sector) &&
            (s.symbol.toLowerCase().includes(search.toLowerCase()) ||
                s.companyName.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (sort === 'price') return b.price - a.price;
            if (sort === 'change') return b.changePercent - a.changePercent;
            if (sort === 'volume') return b.volume - a.volume;
            return a.symbol.localeCompare(b.symbol);
        });

    const handleWatchlistToggle = async (symbol) => {
        if (!user) return toast.error('Login to use watchlist');
        try {
            if (watchlist.includes(symbol)) {
                await removeFromWatchlist(symbol);
                updateUser({ watchlist: watchlist.filter((s) => s !== symbol) });
                toast.success(`Removed ${symbol} from watchlist`);
            } else {
                await addToWatchlist(symbol);
                updateUser({ watchlist: [...watchlist, symbol] });
                toast.success(`Added ${symbol} to watchlist`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating watchlist');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Market</h1>
                <p className="text-gray-500 text-sm mt-1">
                    {stocks.length} stocks · Prices update every 5s
                    <span className="ml-2 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-profit rounded-full animate-pulse" />
                        <span className="text-xs text-profit">Live</span>
                    </span>
                </p>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="input-field w-full sm:w-40"
                    >
                        <option value="name">Name</option>
                        <option value="price">Price ↓</option>
                        <option value="change">Change ↓</option>
                        <option value="volume">Volume ↓</option>
                    </select>
                </div>

                {/* Sectors */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    {SECTORS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSector(s)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${sector === s
                                    ? 'text-red-500 text-white'
                                    : 'bg-dark-300 text-gray-400 hover:text-white'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stocks Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading market data..." /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No stocks found for "{search}"</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((stock) => (
                        <StockCard
                            key={stock.symbol}
                            stock={stock}
                            onWatchlistToggle={handleWatchlistToggle}
                            isWatchlisted={watchlist.includes(stock.symbol)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Market;
