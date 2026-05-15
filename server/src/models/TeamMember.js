const { query } = require('./index');

const TeamMember = {
  findAll: async () => {
    const result = await query('SELECT * FROM team_members WHERE is_active = true ORDER BY display_order ASC, created_at ASC');
    return result.rows;
  },
  
  findAllAdmin: async () => {
    const result = await query('SELECT * FROM team_members ORDER BY display_order ASC, created_at ASC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM team_members WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    const { name, position, bio, image_url, email, linkedin_url, twitter_url, facebook_url, display_order, is_active } = data;
    const result = await query(
      `INSERT INTO team_members (name, position, bio, image_url, email, linkedin_url, twitter_url, facebook_url, display_order, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, position, bio, image_url, email, linkedin_url, twitter_url, facebook_url, display_order, is_active]
    );
    return result.rows[0];
  },
  
  update: async (id, data) => {
    const { name, position, bio, image_url, email, linkedin_url, twitter_url, facebook_url, display_order, is_active } = data;
    const result = await query(
      `UPDATE team_members 
       SET name = $1, position = $2, bio = $3, image_url = $4, email = $5, 
           linkedin_url = $6, twitter_url = $7, facebook_url = $8, display_order = $9, is_active = $10, updated_at = NOW()
       WHERE id = $11 RETURNING *`,
      [name, position, bio, image_url, email, linkedin_url, twitter_url, facebook_url, display_order, is_active, id]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await query('DELETE FROM team_members WHERE id = $1', [id]);
    return true;
  }
};

module.exports = TeamMember;