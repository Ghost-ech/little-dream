const { query } = require('./index');

const Activity = {
  findAll: async () => {
    const result = await query('SELECT * FROM activities ORDER BY created_at DESC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM activities WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    // Vérifiez que image_url est bien dans data
    console.log('Data reçue par create:', data);
    
    const { title, description, category, image_url, status } = data;
    const result = await query(
      'INSERT INTO activities (title, description, category, image_url, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [title, description, category, image_url || null, status || 'active']
    );
    console.log('Résultat insertion:', result.rows[0]);
    return result.rows[0];
  },
  
  update: async (id, data) => {
    console.log('Update data:', data);
    const { title, description, category, image_url, status } = data;
    const result = await query(
      'UPDATE activities SET title = $1, description = $2, category = $3, image_url = $4, status = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [title, description, category, image_url, status, id]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await query('DELETE FROM activities WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Activity;