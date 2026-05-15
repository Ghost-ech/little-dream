const { query } = require('./index');

const Contact = {
  findAll: async () => {
    const result = await query('SELECT * FROM contacts ORDER BY created_at DESC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM contacts WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    const { name, email, subject, message } = data;
    const result = await query(
      'INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    return result.rows[0];
  },
  
  markRead: async (id) => {
    const result = await query(
      'UPDATE contacts SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await query('DELETE FROM contacts WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Contact;