const Stock = require('../models/Stock');

// Simulate small price drift for "live" feel
const applyPriceDrift = (stock) => {
    const drift = (Math.random() - 0.48) * 0.5; // slight upward bias
    const newPrice = parseFloat((stock.price + drift).toFixed(2));
    const change = parseFloat((newPrice - stock.open).toFixed(2));
    const changePercent = parseFloat(((change / stock.open) * 100).toFixed(2));
    return { ...stock.toObject(), price: newPrice, change, changePercent };
};

// @desc    Get all stocks
// @route   GET /api/stocks/all
// @access  Public
const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({}).select('-priceHistory -__v');
        const drifted = stocks.map(applyPriceDrift);
        res.json(drifted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stock by symbol
// @route   GET /api/stocks/:symbol
// @access  Public
const getStockBySymbol = async (req, res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        // Generate 30-day price history for chart
        const history = [];
        let basePrice = stock.open * 0.85;
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            basePrice = parseFloat((basePrice * (1 + (Math.random() - 0.47) * 0.025)).toFixed(2));
            history.push({
                date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                price: basePrice,
            });
        }
        // Last entry = current price
        history.push({
            date: 'Now',
            price: applyPriceDrift(stock).price,
        });

        const drifted = applyPriceDrift(stock);
        res.json({ ...drifted, priceHistory: history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllStocks, getStockBySymbol };
