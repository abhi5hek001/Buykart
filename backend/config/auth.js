/**
 * Authentication Configuration
 * This file contains all authentication-related configuration
 * including JWT settings and security constants
 */

module.exports = {
    // JWT Secret Key - In production, this should be stored in environment variables
    // This key is used to sign and verify JWT tokens
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',

    // JWT Token Expiration Time
    // Format: '7d' = 7 days, '24h' = 24 hours, '60m' = 60 minutes
    jwtExpiresIn: '7d',

    // Salt rounds for bcrypt password hashing
    // Higher number = more secure but slower
    // 10 is a good balance between security and performance
    bcryptSaltRounds: 10,

    // Minimum password length requirement
    minPasswordLength: 6
};
