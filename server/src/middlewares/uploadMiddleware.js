const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers d'upload
const uploadDirs = {
  activities: path.join(__dirname, '../../uploads/activities'),
  events: path.join(__dirname, '../../uploads/events'),
  team: path.join(__dirname, '../../uploads/team'),
  gallery: path.join(__dirname, '../../uploads/gallery')
};

// Créer tous les dossiers
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = (type) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirs[type]);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${type}-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

// Middleware pour différents types
const uploadActivity = multer({ storage: storage('activities'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
const uploadEvent = multer({ storage: storage('events'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
const uploadTeam = multer({ storage: storage('team'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
const uploadGallery = multer({ storage: storage('gallery'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

// Middleware wrapper pour gérer les erreurs
const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({ success: false, message: 'Fichier trop volumineux (max 5MB)' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = {
  uploadActivity: handleUpload(uploadActivity),
  uploadEvent: handleUpload(uploadEvent),
  uploadTeam: handleUpload(uploadTeam),
  uploadGallery: handleUpload(uploadGallery)
};