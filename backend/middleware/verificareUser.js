const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // user conține {_id, isAdmin, etc.}
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
}

function isAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. You are not an admin'
    });
  }
  next();
}

module.exports = { isAuthenticated, isAdmin };
