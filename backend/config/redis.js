const Redis = require('ioredis');

// Redis client configuration
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Don't connect immediately
});

// Connection event handlers
redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

// Try to connect (silent fail if Redis not available)
redis.connect().catch((err) => {
    console.warn('⚠️ Redis not available, caching disabled:', err.message);
});

// Cache TTL constants (in seconds)
const CACHE_TTL = {
    PRODUCT: 300,           // 5 minutes
    PRODUCT_LIST: 60,       // 1 minute
    CATEGORY: 600,          // 10 minutes
    STOCK: 10,              // 10 seconds (volatile data)
    USER: 300               // 5 minutes
};

// Cache key prefixes
const CACHE_KEYS = {
    PRODUCT: 'product:',
    PRODUCT_LIST: 'products:list',
    PRODUCT_SEARCH: 'products:search:',
    CATEGORY: 'category:',
    CATEGORY_LIST: 'categories:list',
    STOCK: 'stock:',
    STOCK_ALL: 'stock:all'
};

module.exports = { redis, CACHE_TTL, CACHE_KEYS };
