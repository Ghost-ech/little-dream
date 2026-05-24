const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const { query } = require('../models/index');

async function createAdmin() {
  const name = process.env.ADMIN_NAME || 'Admin Little Dream';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ ADMIN_PASSWORD doit contenir au moins 8 caractères');
    process.exit(1);
  }

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    const hashed = await bcrypt.hash(password, 12);

    if (existing.rows.length > 0) {
      await query(
        'UPDATE users SET name = $1, password = $2, role = $3 WHERE email = $4',
        [name, hashed, 'admin', email]
      );
      console.log(`✅ Admin mis à jour : ${email}`);
    } else {
      await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [name, email, hashed, 'admin']
      );
      console.log(`✅ Admin créé : ${email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

createAdmin();
