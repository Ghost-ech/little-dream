const express = require('express');
const router = express.Router();
const c = require('../controllers/contactController');
const auth = require('../middlewares/authMiddleware');

router.post('/', c.create);
router.get('/', auth, c.getAll);
router.put('/:id/read', auth, c.markRead);
router.delete('/:id', auth, c.remove);
router.post('/:id/reply', auth, c.reply); // Nouvelle route pour répondre

module.exports = router;