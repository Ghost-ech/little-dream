// server/src/routes/activityRoute.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/activityController');
const auth = require('../middlewares/authMiddleware');
const {uploadActivity} = require('../middlewares/uploadMiddleware')

router.get('/', c.getAll);
router.get('/:id', c.getOne);
router.post('/', auth, uploadActivity, c.create);
router.put('/:id', auth, uploadActivity, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;
