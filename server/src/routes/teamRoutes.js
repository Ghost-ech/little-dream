const express = require('express');
const router = express.Router();
const c = require('../controllers/teamController');
const auth = require('../middlewares/authMiddleware');
const { uploadTeam } = require('../middlewares/uploadMiddleware');

router.get('/', c.getAll);
router.get('/admin', auth, c.getAllAdmin);
router.get('/:id', auth, c.getOne);
router.post('/', auth, uploadTeam, c.create);
router.put('/:id', auth, uploadTeam, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;