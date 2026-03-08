const User = require('../models/User');
const Stock = require('../models/Stock');

// @desc    Get watchlist with current prices
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const stocks = await Stock.find({ symbol: { $in: user.watchlist } }).select('-priceHistory -__v');
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) return res.status(400).json({ message: 'Symbol required' });

        const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        const user = await User.findById(req.user._id);
        if (user.watchlist.includes(symbol.toUpperCase())) {
            return res.status(400).json({ message: 'Stock already in watchlist' });
        }

        user.watchlist.push(symbol.toUpperCase());
        await user.save();

        res.json({ watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeFromWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.watchlist = user.watchlist.filter((s) => s !== req.params.symbol.toUpperCase());
        await user.save();
        res.json({ watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
