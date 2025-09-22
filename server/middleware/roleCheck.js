const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authenticate first' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }
    next();
  };
};

// Use this in controller to verify if the user owns the resource or is admin/chef
const checkOwnership = (resourceUserId) => (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.role === 'chef') return next();
  if (req.user._id.toString() === resourceUserId.toString()) return next();

  return res.status(403).json({ success: false, message: 'Access denied' });
};

module.exports = { authorize, checkOwnership };