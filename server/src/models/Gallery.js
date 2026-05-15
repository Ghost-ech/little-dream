const { query } = require('./index');

const Gallery = {
  findAll: async () => {
    const result = await query('SELECT * FROM gallery ORDER BY created_at DESC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM gallery WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    const { title, image_url, category, activity_id } = data;
    const result = await query(
      'INSERT INTO gallery (title, image_url, category, activity_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, image_url, category, activity_id]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await query('DELETE FROM gallery WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Gallery;