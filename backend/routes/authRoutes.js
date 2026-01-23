/**
 * Authentication Routes
 * Defines endpoints for user authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

// Public routes - no authentication required

/**
 * POST /api/auth/signup
 * Register a new user account
 * Body: { name, email, password, phone?, address? }
 */
router.post('/signup', authController.signup);

/**
 * POST /api/auth/signin
 * Login with existing credentials
 * Body: { email, password }
 */
router.post('/signin', authController.signin);

// Protected routes - require valid JWT token

/**
 * GET /api/auth/profile
 * Get current user's profile information
 * Requires: Authorization header with Bearer token
 */
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
