// src/middlewares/role.middleware.js
const apiResponse = require('../utils/apiResponse.util');

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return apiResponse.error(res, 403, 'Access denied');
    }
    next();
  };
};