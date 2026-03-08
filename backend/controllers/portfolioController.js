const User = require('../models/User');
const Stock = require('../models/Stock');

// @desc    Get user portfolio with current prices & P&L
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const symbols = user.portfolio.map((p) => p.symbol);
        const stocks = await Stock.find({ symbol: { $in: symbols } });

        const enriched = user.portfolio.map((holding) => {
            const stock = stocks.find((s) => s.symbol === holding.symbol);
            const currentPrice = stock ? stock.price : holding.avgBuyPrice;
            const invested = parseFloat((holding.avgBuyPrice * holding.quantity).toFixed(2));
            const current = parseFloat((currentPrice * holding.quantity).toFixed(2));
            const pnl = parseFloat((current - invested).toFixed(2));
            const pnlPercent = parseFloat(((pnl / invested) * 100).toFixed(2));

            return {
                symbol: holding.symbol,
                companyName: holding.companyName,
                quantity: holding.quantity,
                avgBuyPrice: holding.avgBuyPrice,
                currentPrice,
                invested,
                current,
                pnl,
                pnlPercent,
            };
        });

        const totalInvested = enriched.reduce((sum, h) => sum + h.invested, 0);
        const totalCurrent = enriched.reduce((sum, h) => sum + h.current, 0);
        const totalPnl = parseFloat((totalCurrent - totalInvested).toFixed(2));

        res.json({
            holdings: enriched,
            totalInvested: parseFloat(totalInvested.toFixed(2)),
            totalCurrent: parseFloat(totalCurrent.toFixed(2)),
            totalPnl,
            balance: user.balance,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPortfolio };
