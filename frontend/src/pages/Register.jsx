import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created! ₹1,00,000 added to your wallet 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-dark-200">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 text-red-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 text-red-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 text-red-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold">KITE<span className="text-emerald-500">26</span></span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Start trading today</h1>
                    <p className="text-gray-500 text-sm">Get ₹1,00,000 virtual money to practice</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-4">
                    <div className="text-red-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-emerald-500">Get ₹1,00,000 virtual balance instantly on signup</p>
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Rahul Sharma"
                            className="input-field"
                            required
                        />
                    </div>
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
                            placeholder="Min 6 characters"
                            className="input-field"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : 'Create Free Account'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
