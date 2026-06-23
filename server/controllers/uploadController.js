const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Upload image(s)
// @route   POST /api/upload
// @access  Admin
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const imageUrls = req.files.map(
    (file) => `/uploads/${file.filename}`
  );

  res.json({ images: imageUrls });
});

module.exports = { uploadImages };
