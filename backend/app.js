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
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req, res) => {
    res.send(`
      <html>
        <head>
          <style>
            body {
              background-color: black;
              color: white;
              display: flex;
              flex-direction: column;
              height: 100vh;
              justify-content: center;
              align-items: center;
              font-family: Arial, sans-serif;
              font-size: 2rem;
              text-align: center;
            }
            a {
              margin-top: 20px;
              color: #4CAF50;
              text-decoration: none;
              font-size: 1.2rem;
              border: 2px solid #4CAF50;
              padding: 10px 20px;
              border-radius: 5px;
              transition: 0.3s;
            }
            a:hover {
              background-color: #4CAF50;
              color: black;
            }
          </style>
        </head>
        <body>
          <div>
            <h1>Welcome to Buykart</h1>
          </div>
        </body>
      </html>
    `);
});

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
app.use('/api/auth', authRoutes);

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
app.listen(PORT, "0.0.0.0", () => {
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
