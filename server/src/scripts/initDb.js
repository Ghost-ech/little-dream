// Forcer le bon chemin vers .env pour éviter l'erreur "Erreur: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const bcrypt = require('bcryptjs');
const { query } = require('../models/index');

async function initDatabase() {
  console.log('🔄 Initialisation de la base de données...');
  
  try {
    // Create tables
    await query(`
      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Activities
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(500),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Events
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(200),
        event_date TIMESTAMP NOT NULL,
        image_url VARCHAR(500),
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Donations
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_name VARCHAR(150),
        donor_email VARCHAR(150),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'XAF',
        message TEXT,
        payment_status VARCHAR(30) DEFAULT 'pending',
        payment_reference VARCHAR(200),
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Volunteers
      CREATE TABLE IF NOT EXISTS volunteers (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(30),
        city VARCHAR(100),
        motivation TEXT,
        skills TEXT,
        availability VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Contacts
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        subject VARCHAR(200),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Gallery
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        image_url VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        activity_id INT REFERENCES activities(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Stats
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        value INT NOT NULL DEFAULT 0,
        icon VARCHAR(50),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Tables créées');
    console.log("DB_PASSWORD =", process.env.DB_PASSWORD);
    
    // Insert default admin
    const adminExists = await query('SELECT * FROM users WHERE email = $1', ['admin@littledream.cm']);
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin Little Dream', 'admin@littledream.cm', hashedPassword, 'admin']
      );
      console.log('✅ Admin créé (email: admin@littledream.cm, password: password)');
    }
    
    // Insert default stats
    const statsCount = await query('SELECT COUNT(*) FROM stats');
    if (parseInt(statsCount.rows[0].count) === 0) {
      await query(`
        INSERT INTO stats (label, value, icon) VALUES
        ('Enfants aidés', 240, 'children'),
        ('Bénévoles actifs', 45, 'volunteers'),
        ('Activités réalisées', 38, 'activities'),
        ('Dons collectés (FCFA)', 1250000, 'donations')
      `);
      console.log('✅ Statistiques par défaut créées');
    }
    
    console.log('🎉 Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

initDatabase();