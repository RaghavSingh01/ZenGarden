// utils/generateToken.js
const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} - Signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // configurable expiration
  });
};

module.exports = generateToken;