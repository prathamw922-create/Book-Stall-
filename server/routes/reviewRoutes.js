const express = require('express');
const router = express.Router();
const { getBookReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:bookId', getBookReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
