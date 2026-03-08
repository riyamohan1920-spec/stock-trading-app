import { useNavigate } from 'react-router-dom';

const StockCard = ({ stock, onWatchlistToggle, isWatchlisted }) => {
    const navigate = useNavigate();
    const isPositive = stock.change >= 0;

    return (
        <div
            className="card cursor-pointer hover:border-primary-500/40 hover:shadow-primary-500/5 hover:shadow-xl transition-all duration-200 group"
            onClick={() => navigate(`/stock/${stock.symbol}`)}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 text-red-500/15 rounded-xl flex items-center justify-center">
                            <span className="text-emerald-500 font-bold text-xs">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white group-hover:text-emerald-500 transition-colors">{stock.symbol}</h3>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.companyName}</p>
                        </div>
                    </div>
                </div>

                {onWatchlistToggle && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onWatchlistToggle(stock.symbol); }}
                        className={`p-1.5 rounded-lg transition-colors ${isWatchlisted ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        <svg className="w-4 h-4" fill={isWatchlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex items-end justify-between mt-4">
                <div>
                    <p className="text-lg font-bold text-white">
                        ₹{stock.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-600">Vol: {(stock.volume / 1000).toFixed(0)}K</p>
                </div>
                <div className={`text-right ${isPositive ? 'text-profit' : 'text-loss'}`}>
                    <p className="text-sm font-semibold">{isPositive ? '+' : ''}{stock.change?.toFixed(2)}</p>
                    <p className="text-xs">{isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%</p>
                </div>
            </div>

            <div className="mt-3 h-1 rounded-full bg-dark-300 overflow-hidden">
                <div
                    className={`h-full rounded-full ${isPositive ? 'bg-profit' : 'bg-loss'}`}
                    style={{ width: `${Math.min(Math.abs(stock.changePercent || 0) * 10, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default StockCard;
