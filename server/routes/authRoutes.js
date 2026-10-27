import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to sign JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'eventhive_secret_jwt_key_campus_2026',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new student or organizer account & save into MongoDB
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      college,
      department,
      year,
      studentId,
      role,
      clubAffiliation,
      interests,
    } = req.body;

    // Validate presence
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, college/personal email, and password.',
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Generate automatic student ID if omitted
    const generatedStudentId =
      studentId?.trim() ||
      `EH-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create user record in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      college: college?.trim() || 'Apex Institute of Technology',
      department: department?.trim() || 'Computer Science & Engineering',
      year: year || '3rd Year (Junior)',
      studentId: generatedStudentId,
      role: role === 'organizer' ? 'organizer' : 'student',
      clubAffiliation: clubAffiliation?.trim() || '',
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Hackathons', 'Tech Fests', 'Cultural Fests'],
    });

    const token = generateToken(user._id);

    console.log(`[EventHive Auth] New user registered & saved to MongoDB: ${user.email} (${user.role}) - ID: ${user._id}`);

    return res.status(201).json({
      success: true,
      message: 'Account created and saved to MongoDB successfully!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        studentId: user.studentId,
        role: user.role,
        clubAffiliation: user.clubAffiliation,
        interests: user.interests,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered in MongoDB.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query user including password for bcrypt comparison
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please check your credentials or create an account.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please try again.',
      });
    }

    const token = generateToken(user._id);

    console.log(`[EventHive Auth] User logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        studentId: user.studentId,
        role: user.role,
        clubAffiliation: user.clubAffiliation,
        interests: user.interests,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during login. Please try again.',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      college: req.user.college,
      department: req.user.department,
      year: req.user.year,
      studentId: req.user.studentId,
      role: req.user.role,
      clubAffiliation: req.user.clubAffiliation,
      interests: req.user.interests,
      createdAt: req.user.createdAt,
    },
  });
});

// @route   PUT /api/auth/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, college, department, year, studentId, clubAffiliation, interests } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (college) user.college = college.trim();
    if (department) user.department = department.trim();
    if (year) user.year = year;
    if (studentId) user.studentId = studentId.trim();
    if (clubAffiliation !== undefined) user.clubAffiliation = clubAffiliation.trim();
    if (interests && Array.isArray(interests)) user.interests = interests;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

export default router;
