// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value) {
        // Email validation regex
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

// src/api/services/authService.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { AppError } from '../../utils/AppError.js';
import environment from '../../config/environment.js';

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    environment.jwtSecret,
    { expiresIn: environment.jwtExpiresIn }
  );
};

export default {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} New user and token
   */
  register: async (userData) => {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });
    
    if (existingUser) {
      throw AppError.conflict(
        'User already exists with this email or username',
        'ERR_USER_EXISTS'
      );
    }
    
    // Create new user
    const newUser = await User.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    });
    
    // Generate token
    const token = generateToken({
      id: newUser._id,
      role: newUser.role
    });
    
    // Return user (without password) and token
    const user = newUser.toObject();
    delete user.password;
    
    return { user, token };
  },
  
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User and token
   */
  login: async (email, password) => {
    // Find user by email and include password
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      throw AppError.unauthorized(
        'Invalid email or password',
        'ERR_INVALID_CREDENTIALS'
      );
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    // Generate token
    const token = generateToken({
      id: user._id,
      role: user.role
    });
    
    // Return user (without password) and token
    const userObj = user.toObject();
    delete userObj.password;
    
    return { user: userObj, token };
  },
  
  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken: (token) => {
    try {
      return jwt.verify(token, environment.jwtSecret);
    } catch (error) {
      throw AppError.unauthorized(
        'Invalid or expired token',
        'ERR_INVALID_TOKEN'
      );
    }
  }
};

// src/api/controllers/authController.js
import authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(AppError.badRequest(
        'Please provide email and password',
        'ERR_MISSING_CREDENTIALS'
      ));
    }
    
    const { user, token } = await authService.login(email, password);
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// src/api/middlewares/authMiddleware.js
import { AppError } from '../../utils/AppError.js';
import authService from '../services/authService.js';
import User from '../../models/User.js';

/**
 * Protect routes - Authenticate user
 */
export const protect = async (req, res, next) => {
  try {
    // 1) Get token from request headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return next(AppError.unauthorized(
        'You are not logged in. Please log in to get access',
        'ERR_NOT_LOGGED_IN'
      ));
    }
    
    // 2) Verify token
    const decoded = authService.verifyToken(token);
    
    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(AppError.unauthorized(
        'The user associated with this token no longer exists',
        'ERR_USER_NOT_FOUND'
      ));
    }
    
    // 4) Check if user is active
    if (!user.active) {
      return next(AppError.unauthorized(
        'This user account has been deactivated',
        'ERR_USER_INACTIVE'
      ));
    }
    
    // 5) Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Restrict routes to specific roles
 * @param {...string} roles - Allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden(
        'You do not have permission to perform this action',
        'ERR_INSUFFICIENT_PERMISSIONS'
      ));
    }
    
    next();
  };
};

// src/api/routes/v1/authRoutes.js
import express from 'express';
import { register, login } from '../../controllers/authController.js';
import { validate } from '../../middlewares/validator.js';
import { authValidation } from '../../validations/authValidation.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/register', validate(authValidation.register), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(authValidation.login), login);

export default router;

// src/api/validations/authValidation.js
import { body } from 'express-validator';

export const authValidation = {
  register: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ]
};