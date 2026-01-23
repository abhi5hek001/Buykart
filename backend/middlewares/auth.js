/**
 * JWT Authentication Middleware
 * This middleware protects routes by verifying JWT tokens
 * It extracts the token from the Authorization header and validates it
 */

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

/**
 * Middleware to verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        // Expected format: "Bearer <token>"
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'No token provided. Please login to access this resource.'
            });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token format. Use: Bearer <token>'
            });
        }

        // Verify token using JWT secret
        // This will throw an error if token is invalid or expired
        const decoded = jwt.verify(token, authConfig.jwtSecret);

        // Attach user information to request object
        // This makes user data available in route handlers
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };

        // Token is valid, proceed to next middleware/route handler
        next();

    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token. Please login again.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired. Please login again.'
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            error: 'Authentication failed. Please try again.'
        });
    }
};

/**
 * Admin middleware - checks if user has admin role
 * Must be used after authMiddleware
 */
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.'
        });
    }
};

module.exports = { authMiddleware, adminMiddleware };
