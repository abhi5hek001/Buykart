/**
 * ID Generator Utility
 * Generates unique IDs in the format: PREFIX_YYYYMMDD_HASH
 * hash is 4-character uppercase hex string
 */

const crypto = require('crypto');

const generateId = (prefix) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Generate 4-char random hex string
    const hash = crypto.randomBytes(2).toString('hex').toUpperCase();

    return `${prefix}_${dateStr}_${hash}`;
};

module.exports = { generateId };
