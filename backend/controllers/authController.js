/**
 * Authentication Controller
 * Handles user signup, signin, and profile management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authConfig = require('../config/auth');

const prisma = new PrismaClient();

/**
 * Generate JWT token for a user
 * @param {Object} user - User object containing id, email, name, and role
 * @returns {String} JWT token
 */
const generateToken = (user) => {
    // Create payload with user information
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    };

    // Sign and return JWT token
    return jwt.sign(payload, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpiresIn
    });
};

const authController = {
    /**
     * POST /api/auth/signup
     * Register a new user
     */
    async signup(req, res, next) {
        try {
            const { name, email, password, phone, address } = req.body;

            // Validate required fields
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Name, email, and password are required'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email format'
                });
            }

            // Validate password length
            if (password.length < authConfig.minPasswordLength) {
                return res.status(400).json({
                    success: false,
                    error: `Password must be at least ${authConfig.minPasswordLength} characters long`
                });
            }

            // Check if user with this email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already registered. Please use a different email or login.'
                });
            }

            // Hash password before storing in database
            // bcryptSaltRounds determines the complexity of hashing
            const hashedPassword = await bcrypt.hash(password, authConfig.bcryptSaltRounds);

            // Create new user in database
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    phone: phone || null,
                    address: address || null
                }
            });

            // Generate JWT token for the new user
            const token = generateToken(newUser);

            // Return success response with token and user data
            // Note: We exclude password from the response for security
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    token,
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        phone: newUser.phone,
                        address: newUser.address,
                        role: newUser.role
                    }
                }
            });

        } catch (error) {
            // Pass error to global error handler
            next(error);
        }
    },

    /**
     * POST /api/auth/signin
     * Login an existing user
     */
    async signin(req, res, next) {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email and password are required'
                });
            }

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email }
            });

            // Check if user exists
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid email or password'
                });
            }

            // Compare provided password with hashed password in database
            // bcrypt.compare automatically handles the salt
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid email or password'
                });
            }

            // Generate JWT token for authenticated user
            const token = generateToken(user);

            // Return success response with token and user data
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        role: user.role
                    }
                }
            });

        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/auth/profile
     * Get current authenticated user's profile
     * Protected route - requires JWT token
     */
    async getProfile(req, res, next) {
        try {
            // req.user is set by the auth middleware
            // It contains user data extracted from JWT token
            const userId = req.user.id;

            // Fetch complete user data from database
            const user = await prisma.user.findUnique({
                where: { id: userId },
                // Exclude password from the result
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Return user profile
            res.json({
                success: true,
                data: user
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;
