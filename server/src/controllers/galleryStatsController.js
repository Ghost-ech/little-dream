const Gallery = require('../models/Gallery');
const Stat = require('../models/Stat');
const { query } = require('../models');
const path = require('path');
const fs = require('fs');

// Gallery - GET all
// On renvoie image_url tel qu'en base (chemin relatif /uploads/... ou URL externe).
// Le frontend préfixe avec IMAGE_BASE_URL via getImageUrl().
const galleryGetAll = async (req, res) => {
  try {
    const items = await Gallery.findAll();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Gallery - CREATE (avec upload)
const galleryCreate = async (req, res) => {
  try {
    let imageUrl = req.body.image_url;
    
    // Si un fichier a été uploadé, utiliser son chemin
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image requise' });
    }
    
    const item = await Gallery.create({
      title: req.body.title,
      image_url: imageUrl,
      category: req.body.category,
      activity_id: req.body.activity_id || null
    });
    
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Gallery - DELETE
const galleryRemove = async (req, res) => {
  try {
    // Récupérer l'image pour supprimer le fichier
    const item = await Gallery.findById(req.params.id);
    if (item && item.image_url && !item.image_url.startsWith('http')) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../../uploads', path.basename(item.image_url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Gallery.delete(req.params.id);
    res.json({ success: true, message: 'Image supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stats - calculées dynamiquement depuis les vraies tables
const statsGetAll = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM volunteers WHERE status = 'accepted')::int AS volunteers,
        (SELECT COUNT(*) FROM activities WHERE status = 'active')::int AS activities,
        (SELECT COUNT(*) FROM events    WHERE is_published = true)::int AS events,
        (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE payment_status = 'confirmed')::bigint AS donations
    `);
    const row = result.rows[0];
    const stats = [
      { id: 'volunteers', label: 'Bénévoles actifs',      value: Number(row.volunteers), icon: '🤝' },
      { id: 'activities', label: 'Activités réalisées',   value: Number(row.activities), icon: '🎯' },
      { id: 'events',     label: 'Événements organisés',  value: Number(row.events),     icon: '📅' },
      { id: 'donations',  label: 'Dons collectés (FCFA)', value: Number(row.donations),  icon: '💝' },
    ];
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const statsUpdate = async (req, res) => {
  try {
    const { value } = req.body;
    const stat = await Stat.update(req.params.id, value);
    if (!stat) return res.status(404).json({ success: false, message: 'Statistique non trouvée' });
    res.json({ success: true, data: stat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { galleryGetAll, galleryCreate, galleryRemove, statsGetAll, statsUpdate };