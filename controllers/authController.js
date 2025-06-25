import User from '../models/User.js';
import passport from 'passport';

export const renderRegister = (req, res) => {
  res.render('auth/register');
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    req.login(user, (err) => {
      if (err) throw err;
      req.flash('success', 'Welcome!');
      res.redirect('/dashboard');
    });
  } catch (err) {
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
};

export const renderLogin = (req, res) => {
  res.render('auth/login');
};

export const login = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
});

export const logout = (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out');
    res.redirect('/');
  });
};
