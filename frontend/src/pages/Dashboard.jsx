import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import { getPortfolio } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const StatCard = ({ label, value, sub, color = 'text-white' }) => (
    <div className="stat-card">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-600">{sub}</p>}
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { stocks, loading: stocksLoading } = useStocks();
    const [portfolio, setPortfolio] = useState(null);
    const [loadingPortfolio, setLoadingPortfolio] = useState(true);

    useEffect(() => {
        getPortfolio()
            .then((res) => setPortfolio(res.data))
            .catch(console.error)
            .finally(() => setLoadingPortfolio(false));
    }, []);

    const totalValue = (user?.balance || 0) + (portfolio?.totalCurrent || 0);
    const pnl = portfolio?.totalPnl || 0;
    const invested = portfolio?.totalInvested || 0;

    const topGainers = [...stocks]
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 4);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Greeting */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Good day, <span className="text-primary-500">{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here's your portfolio overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Available Balance"
                    value={`₹${(user?.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    color="text-primary-500"
                />
                <StatCard
                    label="Portfolio Value"
                    value={`₹${(portfolio?.totalCurrent || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    sub={`Invested: ₹${invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                />
                <StatCard
                    label="Total Net Worth"
                    value={`₹${totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                />
                <StatCard
                    label="Total P&L"
                    value={`${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    color={pnl >= 0 ? 'text-profit' : 'text-loss'}
                    sub={invested > 0 ? `${((pnl / invested) * 100).toFixed(2)}% return` : ''}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-base">My Holdings</h2>
                            <Link to="/portfolio" className="text-xs text-primary-500 hover:text-primary-600">View All →</Link>
                        </div>
                        {loadingPortfolio ? (
                            <div className="flex justify-center py-8"><LoadingSpinner /></div>
                        ) : portfolio?.holdings?.length === 0 || !portfolio ? (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-3">📈</div>
                                <p className="text-gray-500 text-sm">No holdings yet</p>
                                <Link to="/market" className="btn-primary mt-4 inline-block text-sm py-2 px-5">
                                    Start Investing
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {portfolio.holdings.slice(0, 5).map((h) => (
                                    <Link to={`/stock/${h.symbol}`} key={h.symbol}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors table-row">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 text-red-500/15 rounded-lg flex items-center justify-center">
                                                <span className="text-emerald-500 text-xs font-bold">{h.symbol.slice(0, 2)}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{h.symbol}</p>
                                                <p className="text-xs text-gray-500">{h.quantity} shares</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">₹{h.current.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                            <p className={`text-xs ${h.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                                                {h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl).toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Gainers */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-base">Top Gainers</h2>
                        <Link to="/market" className="text-xs text-primary-500 hover:text-primary-600">Market →</Link>
                    </div>
                    {stocksLoading ? (
                        <div className="flex justify-center py-8"><LoadingSpinner /></div>
                    ) : (
                        <div className="space-y-3">
                            {topGainers.map((s) => (
                                <Link to={`/stock/${s.symbol}`} key={s.symbol}
                                    className="flex items-center justify-between hover:bg-white/[0.02] p-2 rounded-xl transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold">{s.symbol}</p>
                                        <p className="text-xs text-gray-500">₹{s.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <span className={`badge-${s.changePercent >= 0 ? 'profit' : 'loss'}`}>
                                        {s.changePercent >= 0 ? '+' : ''}{s.changePercent?.toFixed(2)}%
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
