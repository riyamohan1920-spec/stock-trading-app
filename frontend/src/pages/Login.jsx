import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-dark-200">
            {/* Glow effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 text-red-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 text-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 text-red-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold">KITE<span className="text-emerald-500">26</span></span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
                    <p className="text-gray-500 text-sm">Sign in to your trading account</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="input-field"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        No account?{' '}
                        <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                            Create one free
                        </Link>
                    </p>
                </form>

                <p className="text-center text-xs text-gray-600 mt-4">
                    Demo: Use any email & password after registering
                </p>
            </div>
        </div>
    );
};

export default Login;
