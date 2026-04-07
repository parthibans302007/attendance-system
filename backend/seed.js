require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedData = async () => {
    await connectDB();
    try {
        // Only seed if no users exist
        const usersCount = await User.countDocuments();
        if (usersCount === 0) {
            await User.create([
                { name: 'Admin User', email: 'admin@sunstone.edu', password: 'password123', role: 'admin', isFirstLogin: false },
                { name: 'Faculty Member', email: 'faculty@sunstone.edu', password: 'password123', role: 'faculty', isFirstLogin: false },
                { name: 'Student One', email: 'student@sunstone.edu', password: 'password123', role: 'student', isFirstLogin: false }
            ]);
            console.log('Demo Users Seeded Successfully: admin@sunstone.edu, faculty@sunstone.edu, student@sunstone.edu (Password: password123)');
        } else {
            console.log('Users already exist, skipping seed.');
        }
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
