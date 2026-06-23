const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getBookReviews = asyncHandler(async (req, res) => {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*, users(name)')
    .eq('book_id', req.params.bookId)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500);
    throw new Error('Error fetching reviews');
  }

  res.json(reviews.map(r => ({ ...r, _id: r.id, user: { ...r.users, _id: r.user_id } })));
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookId, rating, comment } = req.body;

  const { data: book } = await supabase.from('books').select('id').eq('id', bookId).single();
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if user already reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', req.user._id)
    .eq('book_id', bookId)
    .single();

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert([{ user_id: req.user._id, book_id: bookId, rating, comment }])
    .select('*, users(name)')
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  res.status(201).json({ ...review, _id: review.id, user: { ...review.users, _id: review.user_id } });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { data: review, error } = await supabase.from('reviews').select('id, user_id').eq('id', req.params.id).single();

  if (error || !review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user_id !== req.user._id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await supabase.from('reviews').delete().eq('id', req.params.id);
  res.json({ message: 'Review removed' });
});

module.exports = { getBookReviews, createReview, deleteReview };
