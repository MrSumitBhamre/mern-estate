
const pool = require('../config/db.config');

exports.findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
        [email]
    );
    return rows[0];
};

exports.createUser = async (data) => {
    const { role_id, first_name, last_name, email, password } = data;

    const [result] = await pool.query(
        `INSERT INTO users (role_id, first_name, last_name, email, password)
     VALUES (?, ?, ?, ?, ?)`,
        [role_id, first_name, last_name, email, password]
    );

    return result.insertId;
};

exports.storeRefreshToken = async (user_id, token, expires_at) => {
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
        [user_id, token, expires_at]
    );
};

exports.revokeRefreshToken = async (token) => {
    await pool.query(
        `UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?`,
        [token]
    );
};

exports.findRefreshToken = async (token) => {
    const [rows] = await pool.query(
        `SELECT * FROM refresh_tokens 
     WHERE token = ? AND is_revoked = FALSE`,
        [token]
    );
    return rows[0];
};
