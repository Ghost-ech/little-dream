const { query } = require('./index');

const Donation = {
  findAll: async () => {
    const result = await query('SELECT * FROM donations ORDER BY created_at DESC');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM donations WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    const { donor_name, donor_email, amount, currency, message, payment_status, payment_reference, payment_method, phone_number, transaction_id, operator } = data;
    const result = await query(
      `INSERT INTO donations (donor_name, donor_email, amount, currency, message, payment_status, payment_reference, payment_method, phone_number, transaction_id, operator) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [donor_name, donor_email, amount, currency || 'XAF', message, payment_status || 'pending', payment_reference, payment_method || 'cash', phone_number, transaction_id, operator]
    );
    return result.rows[0];
  },
  
  updateStatus: async (id, status) => {
    const result = await query(
      'UPDATE donations SET payment_status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },
  
  getStats: async () => {
    const result = await query(`
      SELECT
        COUNT(CASE WHEN payment_status <> 'rejected' OR payment_status IS NULL THEN 1 END) as total_donations,
        COALESCE(SUM(CASE WHEN payment_status = 'confirmed' THEN amount END), 0) as total_amount,
        COUNT(CASE WHEN payment_status = 'confirmed' THEN 1 END) as confirmed_donations,
        COUNT(CASE WHEN payment_method = 'orange' AND payment_status <> 'rejected' THEN 1 END) as orange_donations,
        COUNT(CASE WHEN payment_method = 'mtn' AND payment_status <> 'rejected' THEN 1 END) as mtn_donations,
        COUNT(CASE WHEN payment_method = 'cash' AND payment_status <> 'rejected' THEN 1 END) as cash_donations
      FROM donations
    `);
    return result.rows[0];
  }
};

module.exports = Donation;