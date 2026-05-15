const pool = require('../config/db');

// Helper for queries
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  pool
};