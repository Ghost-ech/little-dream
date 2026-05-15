const { query } = require('./index');

const Stat = {
  findAll: async () => {
    const result = await query('SELECT * FROM stats ORDER BY id');
    return result.rows;
  },
  
  update: async (id, value) => {
    const result = await query(
      'UPDATE stats SET value = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [value, id]
    );
    return result.rows[0];
  }
};

module.exports = Stat;