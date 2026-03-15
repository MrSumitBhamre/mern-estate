
const jwt = require('jsonwebtoken');
const env = require('../config/env.config');
const apiResponse = require('../utils/apiResponse.util');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return apiResponse.error(res, 401, 'Access token missing');
  }

  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return apiResponse.error(res, 401, 'Invalid or expired token');
  }
};
