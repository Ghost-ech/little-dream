const { query } = require('./index');

const User = {
  findByEmail: async (email) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },
  
  findById: async (id) => {
    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  updatePassword: async (id, hashedPassword) => {
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
  }
};

module.exports = User;