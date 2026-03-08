const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
const buyStock = async (req, res) => {
    try {
        const { symbol, quantity } = req.body;

        if (!symbol || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid symbol or quantity' });
        }

        const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        const user = await User.findById(req.user._id);
        const totalCost = parseFloat((stock.price * quantity).toFixed(2));

        if (user.balance < totalCost) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct balance
        user.balance = parseFloat((user.balance - totalCost).toFixed(2));

        // Update portfolio
        const existingHolding = user.portfolio.find((p) => p.symbol === stock.symbol);
        if (existingHolding) {
            const totalQty = existingHolding.quantity + quantity;
            const totalValue = existingHolding.avgBuyPrice * existingHolding.quantity + stock.price * quantity;
            existingHolding.avgBuyPrice = parseFloat((totalValue / totalQty).toFixed(2));
            existingHolding.quantity = totalQty;
        } else {
            user.portfolio.push({
                symbol: stock.symbol,
                companyName: stock.companyName,
                quantity,
                avgBuyPrice: stock.price,
            });
        }

        await user.save();

        // Save transaction
        await Transaction.create({
            userId: user._id,
            symbol: stock.symbol,
            companyName: stock.companyName,
            type: 'BUY',
            quantity,
            price: stock.price,
            total: totalCost,
        });

        res.json({
            message: `Successfully bought ${quantity} shares of ${stock.symbol}`,
            balance: user.balance,
            portfolio: user.portfolio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
const sellStock = async (req, res) => {
    try {
        const { symbol, quantity } = req.body;

        if (!symbol || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid symbol or quantity' });
        }

        const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        const user = await User.findById(req.user._id);
        const holding = user.portfolio.find((p) => p.symbol === stock.symbol);

        if (!holding || holding.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient shares to sell' });
        }

        const totalValue = parseFloat((stock.price * quantity).toFixed(2));

        // Add balance
        user.balance = parseFloat((user.balance + totalValue).toFixed(2));

        // Update portfolio
        holding.quantity -= quantity;
        if (holding.quantity === 0) {
            user.portfolio = user.portfolio.filter((p) => p.symbol !== stock.symbol);
        }

        await user.save();

        // Save transaction
        await Transaction.create({
            userId: user._id,
            symbol: stock.symbol,
            companyName: stock.companyName,
            type: 'SELL',
            quantity,
            price: stock.price,
            total: totalValue,
        });

        res.json({
            message: `Successfully sold ${quantity} shares of ${stock.symbol}`,
            balance: user.balance,
            portfolio: user.portfolio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get transaction history
// @route   GET /api/trade/history
// @access  Private
const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { buyStock, sellStock, getTransactionHistory };
