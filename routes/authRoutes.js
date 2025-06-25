import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Register form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Register handler
router.post(
  '/register',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        'error',
        errors
          .array()
          .map((e) => e.msg)
          .join('. ')
      );
      return res.redirect('/register');
    }

    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });
      await user.save();
      req.flash('success', 'Account created. Please log in.');
      res.redirect('/login');
    } catch (err) {
      req.flash('error', 'Email already in use');
      res.redirect('/register');
    }
  }
);

// Login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login handler
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/challenges',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out');
    res.redirect('/login');
  });
});

export default router;
