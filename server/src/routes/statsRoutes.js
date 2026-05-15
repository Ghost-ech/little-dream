// server/src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/galleryStatsController');
const auth = require('../middlewares/authMiddleware');

router.get('/', c.statsGetAll);
router.put('/:id', auth, c.statsUpdate);

module.exports = router;
