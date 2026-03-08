const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true, uppercase: true },
    companyName: { type: String, required: true },
    price: { type: Number, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    change: { type: Number, default: 0 },
    changePercent: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    marketCap: { type: String, default: '' },
    sector: { type: String, default: 'Technology' },
    description: { type: String, default: '' },
    priceHistory: [{ price: Number, time: String }],
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
