import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Stocks
export const getAllStocks = () => API.get('/stocks/all');
export const getStockBySymbol = (symbol) => API.get(`/stocks/${symbol}`);

// Trade
export const buyStock = (data) => API.post('/trade/buy', data);
export const sellStock = (data) => API.post('/trade/sell', data);
export const getTransactionHistory = () => API.get('/trade/history');

// Portfolio
export const getPortfolio = () => API.get('/portfolio');

// Watchlist
export const getWatchlist = () => API.get('/watchlist');
export const addToWatchlist = (symbol) => API.post('/watchlist', { symbol });
export const removeFromWatchlist = (symbol) => API.delete(`/watchlist/${symbol}`);

export default API;
