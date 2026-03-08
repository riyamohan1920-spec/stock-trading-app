import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockBySymbol, buyStock, sellStock, addToWatchlist, removeFromWatchlist } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PriceChart from '../components/PriceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TradeModal = ({ type, stock, onClose, onTrade, balance, holding }) => {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);
    const isPositive = stock.change >= 0;
    const maxSell = holding?.quantity || 0;
    const total = (qty * stock.price).toFixed(2);
    const canBuy = balance >= qty * stock.price;

    const handleTrade = async () => {
        if (qty < 1) return toast.error('Quantity must be at least 1');
        if (type === 'BUY' && !canBuy) return toast.error('Insufficient balance');
        if (type === 'SELL' && qty > maxSell) return toast.error('Insufficient shares');
        setLoading(true);
        try {
            await onTrade(qty);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="card w-full max-w-sm border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold ${type === 'BUY' ? 'text-profit' : 'text-loss'}`}>
                        {type === 'BUY' ? '🟢 Buy' : '🔴 Sell'} {stock.symbol}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="bg-dark-300 rounded-xl p-3 mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Current Price</span>
                        <span className="font-bold">₹{stock.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Change</span>
                        <span className={isPositive ? 'text-profit' : 'text-loss'}>
                            {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-1.5 block">
                        Quantity {type === 'SELL' && <span className="text-gray-600">(max: {maxSell})</span>}
                    </label>
                    <div className="flex gap-2">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn-secondary px-4">-</button>
                        <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="input-field text-center flex-1"
                            min="1"
                            max={type === 'SELL' ? maxSell : undefined}
                        />
                        <button onClick={() => setQty(qty + 1)} className="btn-secondary px-4">+</button>
                    </div>
                </div>

                <div className="bg-dark-300 rounded-xl p-3 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Value</span>
                        <span className="font-bold text-white">₹{parseFloat(total).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    {type === 'BUY' && (
                        <div className={`flex justify-between text-xs mt-1 ${canBuy ? 'text-gray-600' : 'text-loss'}`}>
                            <span>Available Balance</span>
                            <span>₹{balance?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleTrade}
                    disabled={loading || (type === 'BUY' && !canBuy) || (type === 'SELL' && maxSell === 0)}
                    className={type === 'BUY' ? 'btn-primary w-full' : 'btn-danger w-full'}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : `${type === 'BUY' ? 'Buy' : 'Sell'} ${qty} share${qty > 1 ? 's' : ''}`}
                </button>
            </div>
        </div>
    );
};

const StockDetail = () => {
    const { symbol } = useParams();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // 'BUY' | 'SELL' | null
    const [refreshKey, setRefreshKey] = useState(0);

    const watchlist = user?.watchlist || [];
    const isWatchlisted = watchlist.includes(symbol?.toUpperCase());
    const holding = user?.portfolio?.find((p) => p.symbol === symbol?.toUpperCase());

    useEffect(() => {
        setLoading(true);
        getStockBySymbol(symbol)
            .then((res) => setStock(res.data))
            .catch(() => { toast.error('Stock not found'); navigate('/market'); })
            .finally(() => setLoading(false));
    }, [symbol, refreshKey]);

    const isPositive = (stock?.change || 0) >= 0;

    const handleWatchlist = async () => {
        try {
            if (isWatchlisted) {
                await removeFromWatchlist(symbol);
                updateUser({ watchlist: watchlist.filter((s) => s !== symbol.toUpperCase()) });
                toast.success('Removed from watchlist');
            } else {
                await addToWatchlist(symbol);
                updateUser({ watchlist: [...watchlist, symbol.toUpperCase()] });
                toast.success('Added to watchlist ⭐');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    const handleTrade = async (qty) => {
        try {
            let res;
            if (modal === 'BUY') {
                res = await buyStock({ symbol, quantity: qty });
                toast.success(`Bought ${qty} shares of ${symbol}! 🎉`);
            } else {
                res = await sellStock({ symbol, quantity: qty });
                toast.success(`Sold ${qty} shares of ${symbol}!`);
            }
            updateUser({ balance: res.data.balance, portfolio: res.data.portfolio });
            setRefreshKey((k) => k + 1);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Trade failed');
            throw err;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" text="Loading stock data..." />
        </div>
    );

    if (!stock) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="w-10 h-10 text-red-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-emerald-500 font-bold text-sm">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{stock.symbol}</h1>
                            <p className="text-gray-500 text-sm">{stock.companyName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="text-3xl font-bold text-white">
                            ₹{stock.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                        <span className={`badge-${isPositive ? 'profit' : 'loss'} text-sm px-3 py-1`}>
                            {isPositive ? '+' : ''}{stock.change?.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handleWatchlist}
                        className={`p-2.5 rounded-xl border transition-colors ${isWatchlisted ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' : 'border-white/10 text-gray-500 hover:text-white'}`}>
                        <svg className="w-5 h-5" fill={isWatchlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                    <button onClick={() => setModal('BUY')} className="btn-primary">Buy</button>
                    <button onClick={() => setModal('SELL')} disabled={!holding} className="btn-danger">Sell</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold">Price History (30 Days)</h2>
                        <span className="text-xs text-gray-500 bg-dark-300 px-2 py-1 rounded-lg">{stock.sector}</span>
                    </div>
                    <PriceChart history={stock.priceHistory || []} symbol={stock.symbol} />
                </div>

                {/* Stats & Holdings */}
                <div className="space-y-4">
                    {/* Stock Stats */}
                    <div className="card space-y-3">
                        <h3 className="font-bold text-sm mb-2">Market Data</h3>
                        {[
                            { label: 'Open', value: `₹${stock.open?.toLocaleString('en-IN')}` },
                            { label: "Day's High", value: `₹${stock.high?.toLocaleString('en-IN')}` },
                            { label: "Day's Low", value: `₹${stock.low?.toLocaleString('en-IN')}` },
                            { label: 'Volume', value: `${(stock.volume / 100000).toFixed(2)}L` },
                            { label: 'Market Cap', value: stock.marketCap || 'N/A' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="text-gray-500">{label}</span>
                                <span className="font-medium">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* My Holdings */}
                    {holding && (
                        <div className="card border border-primary-500/20">
                            <h3 className="font-bold text-sm mb-3">My Holdings</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Quantity</span>
                                    <span className="font-bold">{holding.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Avg Buy Price</span>
                                    <span className="font-medium">₹{holding.avgBuyPrice?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Invested</span>
                                    <span className="font-medium">₹{(holding.avgBuyPrice * holding.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Current Value</span>
                                    <span className="font-bold">₹{(stock.price * holding.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                {(() => {
                                    const pnl = (stock.price - holding.avgBuyPrice) * holding.quantity;
                                    return (
                                        <div className="flex justify-between pt-2 border-t border-white/5">
                                            <span className="text-gray-500">P&L</span>
                                            <span className={`font-bold ${pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                                                {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {stock.description && (
                        <div className="card">
                            <h3 className="font-bold text-sm mb-2">About</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{stock.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Trade Modal */}
            {modal && (
                <TradeModal
                    type={modal}
                    stock={stock}
                    onClose={() => setModal(null)}
                    onTrade={handleTrade}
                    balance={user?.balance}
                    holding={holding}
                />
            )}
        </div>
    );
};

export default StockDetail;
