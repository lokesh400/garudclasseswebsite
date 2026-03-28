require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const passport = require('passport');
const http = require('http');
const https = require('https');
const Admin = require('./models/Admin');
const cors = require('cors');
const axios = require('axios');

const app = express();

// ─── Database Connection ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ─── Security & Performance ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
// ─── View Engine ───────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Static Files ──────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ─── Sessions ──────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(flash());

// ─── Passport ──────────────────────────────────────────────────────────────
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

const QuickLink = require('./models/QuickLink');

// ─── Global Locals ─────────────────────────────────────────────────────────
app.use(async (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user || null;
  res.locals.siteUrl = process.env.SITE_URL || 'https://www.garudclasses.com';
  res.locals.currentPath = req.path;
  try {
    res.locals.basicLinks = await QuickLink.find({ isActive: true, category: 'basic' }).sort({ order: 1 }).lean();
    res.locals.bannerLink = await QuickLink.findOne({ isActive: true, category: 'banner' }).lean() || null;
  } catch (_) {
    res.locals.basicLinks = [];
    res.locals.bannerLink = null;
  }
  next();
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/', require('./routes/main'));
app.use('/results', require('./routes/results'));
app.use('/faculty', require('./routes/faculty'));
app.use('/courses', require('./routes/courses'));
app.use('/gallery', require('./routes/gallery'));
app.use('/contact', require('./routes/contact'));
app.use('/blog', require('./routes/blog'));
app.use('/admin', require('./routes/admin'));
app.use('/api/chat', require('./routes/chatbot'));
app.use('/recruitments', require('./routes/recruitmentPublic'));

// ─── Sitemap & Robots ──────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${process.env.SITE_URL}/sitemap.xml`);
});

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ─── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found | Garud Classes',
    description: 'The page you are looking for does not exist.',
    page: ''
  });
});

// ─── Error Handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error | Garud Classes',
    description: 'Something went wrong.',
    page: '',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

function startKeepAlive(port) {
  setInterval(async () => {
    const result = await axios.get(`https://garudclasses.com/health`, { timeout: 5000 }).catch(err => {
      console.error('Keep-alive error:', err.message);
      return null;
    });
    if (result) console.log(`🔄 Keep-alive ping → ${result.status} OK`);
  }, 10000);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Garud Classes running at http://localhost:${PORT}`);
  startKeepAlive();
});
