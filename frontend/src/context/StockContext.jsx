import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllStocks } from '../services/api';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStocks = useCallback(async () => {
        try {
            const res = await getAllStocks();
            setStocks(res.data);
        } catch (err) {
            console.error('Failed to fetch stocks:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStocks();
        // Poll every 5 seconds for mock real-time updates
        const interval = setInterval(fetchStocks, 5000);
        return () => clearInterval(interval);
    }, [fetchStocks]);

    const getStock = (symbol) => stocks.find((s) => s.symbol === symbol);

    return (
        <StockContext.Provider value={{ stocks, loading, fetchStocks, getStock }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStocks = () => {
    const ctx = useContext(StockContext);
    if (!ctx) throw new Error('useStocks must be used within StockProvider');
    return ctx;
};
