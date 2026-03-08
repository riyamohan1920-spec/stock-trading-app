const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI missing in .env');
    process.exit(1);
}

// Log without password
console.log('✅ MONGODB_URI:', MONGODB_URI.replace(/avinash45:avishan18@/, 'avinash45:****@'));
console.log('📡 Connecting to MongoDB...\n');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

// Routes
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/stocks', require('./routes/stocks'));
    app.use('/api/trade', require('./routes/trade'));
    app.use('/api/portfolio', require('./routes/portfolio'));
    app.use('/api/watchlist', require('./routes/watchlist'));
    console.log('✅ Routes loaded');
} catch (err) {
    console.log('⚠️ Some routes missing:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Simple connection - no options needed for mongoose 6+
        const conn = await mongoose.connect(MONGODB_URI);
        
        console.log('\n✅✅✅ CONNECTED TO MONGODB ✅✅✅');
        console.log(`📊 Host: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);
        console.log(`📅 Ready State: ${conn.connection.readyState}\n`);
        
        return conn;
    } catch (error) {
        console.error('\n❌❌❌ CONNECTION FAILED ❌❌❌');
        console.error('Error:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n🔧 FIX:');
            console.log('1. Open https://cloud.mongodb.com');
            console.log('2. Network Access → Add IP → 0.0.0.0/0');
            console.log('3. Wait 2 minutes\n');
        }
        
        if (error.message.includes('Authentication')) {
            console.log('\n🔧 FIX:');
            console.log('1. Database Access → check user: avinash45');
            console.log('2. Password: avishan18');
            console.log('3. Reset password if needed\n');
        }
        
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server: http://localhost:${PORT}`);
            console.log(`📝 Health: http://localhost:${PORT}/api/health\n`);
        });
    } catch (err) {
        console.error('Server error:', err);
        process.exit(1);
    }
};

startServer();