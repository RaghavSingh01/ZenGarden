// CommonJS param middleware for router.param
const mongoose = require('mongoose');

function validateObjectId(req, res, next, value, name) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ message: `Invalid ${name || 'id'}` });
  }
  next();
}

module.exports = validateObjectId;