const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    res.status(500);
    throw new Error('Error fetching categories');
  }

  // Map to include a dynamic bookCount if needed by frontend
  // Since we don't store bookCount in DB anymore, we fetch counts dynamically
  const enrichedCategories = await Promise.all(categories.map(async (cat) => {
    const { count } = await supabase
      .from('books')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', cat.id);
      
    return {
      _id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      bookCount: count || 0
    };
  }));

  res.json(enrichedCategories);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  const { data: categoryExists } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .single();

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const { data: category, error } = await supabase
    .from('categories')
    .insert([{ name, description, image }])
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error('Failed to create category');
  }

  res.status(201).json({ ...category, _id: category.id });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { data: category, error } = await supabase
    .from('categories')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ ...category, _id: category.id });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const { count } = await supabase
    .from('books')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', req.params.id);

  if (count > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${count} books. Remove or reassign books first.`);
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ message: 'Category removed' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
