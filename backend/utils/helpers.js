// Utility helper functions

// Format price to currency string
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
};

// Generate order reference number
const generateOrderRef = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${timestamp}-${random}`;
};

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Paginate results
const paginate = (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
        data: array.slice(startIndex, endIndex),
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(array.length / limit),
            totalItems: array.length,
            itemsPerPage: limit
        }
    };
};

module.exports = {
    formatPrice,
    generateOrderRef,
    isValidEmail,
    paginate
};
