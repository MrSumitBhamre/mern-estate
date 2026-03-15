
exports.success = (res, message, data = {}, meta = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta
  });
};

exports.error = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: {},
    meta: {}
  });
};
