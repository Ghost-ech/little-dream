// server/src/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/donationController');
const auth = require('../middlewares/authMiddleware');

router.post('/', c.create);
router.get('/', auth, c.getAll);
router.get('/stats', auth, c.getStats);
router.put('/:id/status', auth, c.updateStatus);

module.exports = router;
