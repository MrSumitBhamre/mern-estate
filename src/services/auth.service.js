
const jwtConfig = require('../config/jwt.config');
const passwordUtil = require('../utils/password.util');
const repo = require('../repositories/auth.repository');
const roles = require('../constants/roles.constant');
const pool = require('../config/db.config');

exports.register = async (payload) => {
    const existing = await repo.findUserByEmail(payload.email);
    if (existing) throw new Error('Email already registered');

    const [roleRow] = await pool.query(
        'SELECT id FROM roles WHERE name = ?',
        [payload.role]
    );

    const role_id = roleRow[0].id;

    const hashed = await passwordUtil.hashPassword(payload.password);

    const userId = await repo.createUser({
        role_id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: hashed
    });

    return { userId };
};

exports.login = async ({ email, password }) => {
    const user = await repo.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const match = await passwordUtil.comparePassword(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const payload = {
        id: user.id,
        role: user.role_id
    };

    const accessToken = jwtConfig.generateAccessToken(payload);
    const refreshToken = jwtConfig.generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await repo.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
};
