const { query } = require('./index');

const Event = {
  findAll: async () => {
    const result = await query('SELECT * FROM events ORDER BY event_date DESC');
    return result.rows;
  },
  
  findPublished: async () => {
    const result = await query('SELECT * FROM events WHERE is_published = true AND event_date >= NOW() ORDER BY event_date ASC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    const { title, description, location, event_date, image_url, is_published } = data;
    const result = await query(
      'INSERT INTO events (title, description, location, event_date, image_url, is_published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, location, event_date, image_url, is_published !== false]
    );
    return result.rows[0];
  },
  
  update: async (id, data) => {
    const { title, description, location, event_date, image_url, is_published } = data;
    const result = await query(
      'UPDATE events SET title = $1, description = $2, location = $3, event_date = $4, image_url = $5, is_published = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [title, description, location, event_date, image_url, is_published, id]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await query('DELETE FROM events WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Event;