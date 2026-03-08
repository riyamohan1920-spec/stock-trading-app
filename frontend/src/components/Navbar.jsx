import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        isActive ? 'nav-link-active' : 'nav-link';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-100/95 backdrop-blur-sm border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 text-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white">
                        KITE<span className="text-primary-500">26</span>
                    </span>
                </Link>

                {/* Nav Links */}
                {user && (
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                        <NavLink to="/market" className={navLinkClass}>Market</NavLink>
                        <NavLink to="/portfolio" className={navLinkClass}>Portfolio</NavLink>
                        <NavLink to="/watchlist" className={navLinkClass}>Watchlist</NavLink>
                        <NavLink to="/transactions" className={navLinkClass}>History</NavLink>
                    </div>
                )}

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs text-gray-500">Balance</span>
                                <span className="text-sm font-bold text-primary-500">
                                    ₹{user.balance?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="w-8 h-8 text-red-500/20 rounded-full flex items-center justify-center">
                                <span className="text-emerald-500 font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-gray-400 hover:text-white transition-colors bg-dark-300 px-3 py-1.5 rounded-lg border border-white/5"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                            <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Nav */}
            {user && (
                <div className="md:hidden flex gap-4 px-4 pb-3 overflow-x-auto">
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/market" className={navLinkClass}>Market</NavLink>
                    <NavLink to="/portfolio" className={navLinkClass}>Portfolio</NavLink>
                    <NavLink to="/watchlist" className={navLinkClass}>Watchlist</NavLink>
                    <NavLink to="/transactions" className={navLinkClass}>History</NavLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
