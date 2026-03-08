const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('./models/Stock');

dotenv.config();

const stocks = [
    { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd', price: 2845.50, open: 2820.00, high: 2870.00, low: 2800.00, volume: 3245678, marketCap: '₹19.2L Cr', sector: 'Energy', description: 'Indias largest private sector corporation, with businesses across energy, petrochemicals, retail, and telecom.' },
    { symbol: 'TCS', companyName: 'Tata Consultancy Services', price: 3678.25, open: 3650.00, high: 3700.00, low: 3630.00, volume: 1234567, marketCap: '₹13.4L Cr', sector: 'Technology', description: 'Global IT services, consulting, and business solutions leader.' },
    { symbol: 'INFY', companyName: 'Infosys Ltd', price: 1456.80, open: 1440.00, high: 1470.00, low: 1435.00, volume: 2345678, marketCap: '₹6.1L Cr', sector: 'Technology', description: 'Next-generation digital services and consulting company.' },
    { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd', price: 1623.40, open: 1610.00, high: 1640.00, low: 1605.00, volume: 4567890, marketCap: '₹12.4L Cr', sector: 'Banking', description: 'Indias largest private sector bank by assets.' },
    { symbol: 'WIPRO', companyName: 'Wipro Ltd', price: 456.75, open: 450.00, high: 462.00, low: 448.00, volume: 3456789, marketCap: '₹2.4L Cr', sector: 'Technology', description: 'Global IT, consulting, and business process services company.' },
    { symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd', price: 987.60, open: 975.00, high: 995.00, low: 972.00, volume: 5678901, marketCap: '₹7.0L Cr', sector: 'Banking', description: 'Private sector banking and financial services company.' },
    { symbol: 'BAJFINANCE', companyName: 'Bajaj Finance Ltd', price: 7234.00, open: 7180.00, high: 7290.00, low: 7150.00, volume: 890123, marketCap: '₹4.4L Cr', sector: 'Finance', description: 'Non-banking financial corporation for consumer and commercial lending.' },
    { symbol: 'SUNPHARMA', companyName: 'Sun Pharmaceutical', price: 1189.30, open: 1175.00, high: 1200.00, low: 1168.00, volume: 1567890, marketCap: '₹2.9L Cr', sector: 'Pharma', description: 'Specialty pharmaceuticals and generic drugs manufacturer.' },
    { symbol: 'TATAMOTORS', companyName: 'Tata Motors Ltd', price: 834.55, open: 820.00, high: 845.00, low: 815.00, volume: 6789012, marketCap: '₹3.1L Cr', sector: 'Auto', description: 'Automobile manufacturer and Jaguar Land Rover parent company.' },
    { symbol: 'LT', companyName: 'Larsen & Toubro Ltd', price: 3456.90, open: 3420.00, high: 3480.00, low: 3410.00, volume: 789012, marketCap: '₹4.8L Cr', sector: 'Infrastructure', description: 'Multinational conglomerate in engineering, construction, and technology.' },
    { symbol: 'ASIANPAINT', companyName: 'Asian Paints Ltd', price: 2987.45, open: 2960.00, high: 3010.00, low: 2950.00, volume: 456789, marketCap: '₹2.9L Cr', sector: 'Consumer', description: 'Indias largest paint company and Asian market leader.' },
    { symbol: 'HINDUNILVR', companyName: 'Hindustan Unilever Ltd', price: 2567.80, open: 2545.00, high: 2585.00, low: 2535.00, volume: 567890, marketCap: '₹6.0L Cr', sector: 'FMCG', description: 'Consumer goods company with popular brands across home and personal care.' },
    { symbol: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank', price: 1789.50, open: 1770.00, high: 1805.00, low: 1762.00, volume: 1234567, marketCap: '₹3.6L Cr', sector: 'Banking', description: 'Private sector bank with banking, insurance, and investment products.' },
    { symbol: 'MARUTI', companyName: 'Maruti Suzuki India', price: 10234.00, open: 10150.00, high: 10310.00, low: 10100.00, volume: 345678, marketCap: '₹3.1L Cr', sector: 'Auto', description: 'Indias largest passenger vehicle manufacturer.' },
    { symbol: 'NESTLEIND', companyName: 'Nestle India Ltd', price: 22456.00, open: 22300.00, high: 22600.00, low: 22200.00, volume: 123456, marketCap: '₹2.2L Cr', sector: 'FMCG', description: 'Nutritions, health and wellness products company.' },
    { symbol: 'POWERGRID', companyName: 'Power Grid Corp of India', price: 267.40, open: 264.00, high: 270.00, low: 262.00, volume: 7890123, marketCap: '₹2.5L Cr', sector: 'Utilities', description: 'Indias central transmission utility for power.' },
    { symbol: 'ONGC', companyName: 'Oil & Natural Gas Corp', price: 178.60, open: 176.00, high: 181.00, low: 175.00, volume: 9012345, marketCap: '₹2.3L Cr', sector: 'Energy', description: 'Indias largest oil and gas exploration and production company.' },
    { symbol: 'NTPC', companyName: 'NTPC Ltd', price: 356.80, open: 352.00, high: 360.00, low: 350.00, volume: 5678901, marketCap: '₹3.5L Cr', sector: 'Utilities', description: 'Indias largest power generation company.' },
    { symbol: 'HCLTECH', companyName: 'HCL Technologies Ltd', price: 1567.30, open: 1550.00, high: 1580.00, low: 1542.00, volume: 1890123, marketCap: '₹4.3L Cr', sector: 'Technology', description: 'Global technology company delivering enterprise IT and engineering services.' },
    { symbol: 'TECHM', companyName: 'Tech Mahindra Ltd', price: 1234.50, open: 1220.00, high: 1248.00, low: 1215.00, volume: 2345678, marketCap: '₹1.2L Cr', sector: 'Technology', description: 'IT solutions and business process outsourcing company.' },
];

const seedStocks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        await Stock.deleteMany({});
        console.log('Cleared existing stocks');

        // Add derived fields
        const enriched = stocks.map((s) => ({
            ...s,
            change: parseFloat((s.price - s.open).toFixed(2)),
            changePercent: parseFloat((((s.price - s.open) / s.open) * 100).toFixed(2)),
        }));

        await Stock.insertMany(enriched);
        console.log(`✅ Seeded ${enriched.length} stocks successfully!`);
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
};

seedStocks();
