// roleMiddleware.js

// Middleware function tocheck user roles
module.exports = function (requiredRoles) {
  return function (req, res, next) {
    const userRole = req.user.role;  // Assume req.user is populated by auth middleware

    // Check if the user's role is in the list of required roles
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ msg: 'Access denied: you do not have permission to access this' });
    }

    next();
  };
};

