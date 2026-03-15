
const jwt = require('jsonwebtoken');
const env = require('./env.config');

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, env.jwt.accessSecret, {
        expiresIn: env.jwt.accessExpires
    });
};

exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.jwt.refreshSecret, {
        expiresIn: env.jwt.refreshExpires
    });
};
