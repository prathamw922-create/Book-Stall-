const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const { data: userExists } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { data: user, error } = await supabase
    .from('users')
    .insert([{ name, email, phone, password: hashedPassword }])
    .select()
    .single();

  if (error) {
    console.error(error);
    res.status(400);
    throw new Error('Invalid user data');
  }

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.is_admin ? 'admin' : 'user',
    token: generateToken(user.id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.is_admin ? 'admin' : 'user',
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user._id)
    .single();

  if (error || !user) {
    res.status(404);
    throw new Error('User not found');
  }

  delete user.password;
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user._id)
    .single();

  if (user) {
    const updates = {
      name: req.body.name || user.name,
      phone: req.body.phone || user.phone,
    };

    if (req.body.email && req.body.email !== user.email) {
      const { data: emailExists } = await supabase
        .from('users')
        .select('id')
        .eq('email', req.body.email)
        .single();

      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      updates.email = req.body.email;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      res.status(400);
      throw new Error('Failed to update profile');
    }

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.is_admin ? 'admin' : 'user',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { register, login, getMe, updateProfile };
