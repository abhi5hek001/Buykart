// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.message.includes('not found')) {
        statusCode = 404;
    } else if (err.message.includes('required') || err.message.includes('Invalid')) {
        statusCode = 400;
    } else if (err.message.includes('already') || err.message.includes('duplicate')) {
        statusCode = 409;
    } else if (err.message.includes('Insufficient stock')) {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
