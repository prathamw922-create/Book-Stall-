const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.post('/', protect, admin, upload.array('images', 5), uploadImages);

module.exports = router;
