const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists:', adminExists.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@bookstall.com',
      phone: '0000000000',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
    });

    console.log(`Admin user created: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
