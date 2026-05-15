// server/src/routes/volunteerRoutes.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/volunteerController');
const auth = require('../middlewares/authMiddleware');

router.post('/', c.register);
router.get('/', auth, c.getAll);
router.put('/:id/status', auth, c.updateStatus);
router.delete('/:id', auth, c.remove);

module.exports = router;
