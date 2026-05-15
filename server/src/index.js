// server/src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const donationRoutes = require('./routes/donationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const activityRoutes = require('./routes/activityRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();

// Configuration CORS TRÈS permissive pour le développement
app.use(cors({
  origin: true,  // Accepte TOUTES les origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// S'assurer que les preflight requests sont gérées
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/team', teamRoutes);
app.use('/api/donations', donationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Little Dream API is running 🌟' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Little Dream démarré sur le port ${PORT}`);
  console.log(`✅ CORS: Toutes les origins sont acceptées (mode développement)`);
});