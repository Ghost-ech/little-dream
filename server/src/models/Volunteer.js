const { query } = require('./index');

const Volunteer = {
  findAll: async () => {
    const result = await query('SELECT * FROM volunteers ORDER BY created_at DESC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM volunteers WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    const { full_name, email, phone, city, motivation, skills, availability } = data;
    const result = await query(
      'INSERT INTO volunteers (full_name, email, phone, city, motivation, skills, availability) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [full_name, email, phone, city, motivation, skills, availability]
    );
    return result.rows[0];
  },
  
  updateStatus: async (id, status) => {
    const result = await query(
      'UPDATE volunteers SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await query('DELETE FROM volunteers WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Volunteer;