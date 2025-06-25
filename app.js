import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import passport from 'passport';
import csrf from 'csurf';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';

import authRoutes from './routes/authRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import entryRoutes from './routes/entryRoutes.js';
import { ensureAuthenticated } from './middleware/auth.js';
import { setFlashMessages } from './middleware/flash.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// __dirname substitute in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboardcat',
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use(helmet());
app.use(xss());
app.use(csrf({ cookie: false }));

// Passport config
import './passport/config.js';
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Flash locals
app.use(setFlashMessages);

// Routes
app.use('/', authRoutes);
app.use('/challenges', ensureAuthenticated, challengeRoutes);
app.use('/entries', ensureAuthenticated, entryRoutes);

// Root route
app.get('/', (req, res) => {
  res.redirect('/challenges');
});

// Database + Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.use((req, res) => {
      res.status(404).render('404');
    });
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB Error:', err));
