const express = require('express');
const router = express.Router();
const c = require('../controllers/eventController');
const auth = require('../middlewares/authMiddleware');
const { uploadEvent } = require('../middlewares/uploadMiddleware');

router.get('/', c.getAll);
router.get('/public', c.getPublished);
router.get('/:id', c.getOne);
router.post('/', auth, uploadEvent, c.create);
router.put('/:id', auth, uploadEvent, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;