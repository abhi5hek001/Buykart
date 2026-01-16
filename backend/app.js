const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import middlewares
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const stockRoutes = require('./routes/stockRoutes');

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = [
  'https://buykart.sahayabhishek.tech',
  "https://sahayabhishek.tech",
  'http://localhost:5173',              
  'https://d14guvrkz04ph7.cloudfront.net' 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Buykart API is running!',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/stock', stockRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🛒 Buykart Backend API Server                   ║
║                                                   ║
║   Server running on: http://localhost:${PORT}        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

module.exports = app;
