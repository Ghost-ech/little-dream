const express = require('express');
const router = express.Router();
const c = require('../controllers/galleryStatsController');
const auth = require('../middlewares/authMiddleware');
const { uploadGallery } = require('../middlewares/uploadMiddleware');

router.get('/', c.galleryGetAll);
router.post('/', auth, uploadGallery, c.galleryCreate);
router.delete('/:id', auth, c.galleryRemove);

module.exports = router;