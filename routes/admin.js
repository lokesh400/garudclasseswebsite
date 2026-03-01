const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Admin = require('../models/Admin');
const Result = require('../models/Result');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Banner = require('../models/Banner');

// ─── Multer Setup ──────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Auth Middleware ───────────────────────────────────────────────────────
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please log in to access the admin panel');
  res.redirect('/admin/login');
};

// ─── Admin Login ───────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/admin/dashboard');
  res.render('admin/login', { title: 'Admin Login | Garud Classes', description: '', keywords: '', page: 'admin' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin/login',
  failureFlash: true,
  successFlash: 'Welcome back!'
}));

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully');
    res.redirect('/admin/login');
  });
});

// ─── Dashboard ─────────────────────────────────────────────────────────────
router.get('/dashboard', isAdmin, async (req, res) => {
  const [resultsCount, facultyCount, coursesCount, unreadContacts, recentContacts] = await Promise.all([
    Result.countDocuments(),
    Faculty.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    Contact.countDocuments({ isRead: false }),
    Contact.find().sort({ createdAt: -1 }).limit(5)
  ]);
  res.render('admin/dashboard', { title: 'Dashboard | Admin', description: '', keywords: '', resultsCount, facultyCount, coursesCount, unreadContacts, recentContacts, page: 'admin' });
});

// ─── Results CRUD ──────────────────────────────────────────────────────────
router.get('/results', isAdmin, async (req, res) => {
  const results = await Result.find().sort({ createdAt: -1 });
  res.render('admin/results', { title: 'Manage Results', description: '', keywords: '', results, page: 'admin' });
});
router.get('/results/new', isAdmin, (req, res) => res.render('admin/result-form', { title: 'Add Result', description: '', keywords: '', result: null, page: 'admin' }));
router.post('/results', isAdmin, upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    await Result.create(data);
    req.flash('success', 'Result added successfully');
    res.redirect('/admin/results');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/results/new'); }
});
router.get('/results/:id/edit', isAdmin, async (req, res) => {
  const result = await Result.findById(req.params.id);
  res.render('admin/result-form', { title: 'Edit Result', description: '', keywords: '', result, page: 'admin' });
});
router.put('/results/:id', isAdmin, upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    await Result.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Result updated');
    res.redirect('/admin/results');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/results'); }
});
router.delete('/results/:id', isAdmin, async (req, res) => {
  await Result.findByIdAndDelete(req.params.id);
  req.flash('success', 'Result deleted');
  res.redirect('/admin/results');
});

// ─── Faculty CRUD ──────────────────────────────────────────────────────────
router.get('/faculty', isAdmin, async (req, res) => {
  const faculties = await Faculty.find().sort({ order: 1 });
  res.render('admin/faculty', { title: 'Manage Faculty', description: '', keywords: '', faculties, page: 'admin' });
});
router.get('/faculty/new', isAdmin, (req, res) => res.render('admin/faculty-form', { title: 'Add Faculty', description: '', keywords: '', faculty: null, page: 'admin' }));
router.post('/faculty', isAdmin, upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    data.achievements = req.body.achievements ? req.body.achievements.split('\n').filter(a => a.trim()) : [];
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    await Faculty.create(data);
    req.flash('success', 'Faculty added successfully');
    res.redirect('/admin/faculty');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/faculty/new'); }
});
router.get('/faculty/:id/edit', isAdmin, async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  res.render('admin/faculty-form', { title: 'Edit Faculty', description: '', keywords: '', faculty, page: 'admin' });
});
router.put('/faculty/:id', isAdmin, upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    data.achievements = req.body.achievements ? req.body.achievements.split('\n').filter(a => a.trim()) : [];
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    await Faculty.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Faculty updated');
    res.redirect('/admin/faculty');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/faculty'); }
});
router.delete('/faculty/:id', isAdmin, async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  req.flash('success', 'Faculty deleted');
  res.redirect('/admin/faculty');
});

// ─── Courses CRUD ──────────────────────────────────────────────────────────
router.get('/courses', isAdmin, async (req, res) => {
  const courses = await Course.find().sort({ order: 1 });
  res.render('admin/courses', { title: 'Manage Courses', description: '', keywords: '', courses, page: 'admin' });
});
router.get('/courses/new', isAdmin, (req, res) => res.render('admin/course-form', { title: 'Add Course', description: '', keywords: '', course: null, page: 'admin' }));
router.post('/courses', isAdmin, upload.single('banner'), async (req, res) => {
  try {
    const data = req.body;
    data.features = req.body.features ? req.body.features.split('\n').filter(f => f.trim()) : [];
    if (req.file) data.banner = '/uploads/' + req.file.filename;
    await Course.create(data);
    req.flash('success', 'Course added');
    res.redirect('/admin/courses');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/courses/new'); }
});
router.get('/courses/:id/edit', isAdmin, async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('admin/course-form', { title: 'Edit Course', description: '', keywords: '', course, page: 'admin' });
});
router.put('/courses/:id', isAdmin, upload.single('banner'), async (req, res) => {
  try {
    const data = req.body;
    data.features = req.body.features ? req.body.features.split('\n').filter(f => f.trim()) : [];
    if (req.file) data.banner = '/uploads/' + req.file.filename;
    await Course.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Course updated');
    res.redirect('/admin/courses');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/courses'); }
});
router.delete('/courses/:id', isAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  req.flash('success', 'Course deleted');
  res.redirect('/admin/courses');
});

// ─── Gallery CRUD ──────────────────────────────────────────────────────────
router.get('/gallery', isAdmin, async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.render('admin/gallery', { title: 'Manage Gallery', description: '', keywords: '', items, page: 'admin' });
});
router.post('/gallery', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = '/uploads/' + req.file.filename;
    await Gallery.create(data);
    req.flash('success', 'Image added');
    res.redirect('/admin/gallery');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/gallery'); }
});
router.delete('/gallery/:id', isAdmin, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  req.flash('success', 'Image deleted');
  res.redirect('/admin/gallery');
});

// ─── Blog CRUD ─────────────────────────────────────────────────────────────
router.get('/blog', isAdmin, async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render('admin/blog', { title: 'Manage Blog', description: '', keywords: '', blogs, page: 'admin' });
});
router.get('/blog/new', isAdmin, (req, res) => res.render('admin/blog-form', { title: 'Add Blog Post', description: '', keywords: '', blog: null, page: 'admin' }));
router.post('/blog', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    data.isPublished = req.body.isPublished === 'true';
    data.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [];
    if (req.file) data.image = '/uploads/' + req.file.filename;
    await Blog.create(data);
    req.flash('success', 'Blog post added');
    res.redirect('/admin/blog');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/blog/new'); }
});
router.get('/blog/:id/edit', isAdmin, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('admin/blog-form', { title: 'Edit Blog Post', description: '', keywords: '', blog, page: 'admin' });
});
router.put('/blog/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    data.isPublished = req.body.isPublished === 'true';
    data.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [];
    if (req.file) data.image = '/uploads/' + req.file.filename;
    await Blog.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Blog updated');
    res.redirect('/admin/blog');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/blog'); }
});
router.delete('/blog/:id', isAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  req.flash('success', 'Blog deleted');
  res.redirect('/admin/blog');
});
// ─── Banners ─────────────────────────────────────────────────────────────────
router.get('/banners', isAdmin, async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 });
  res.render('admin/banners', { title: 'Manage Banners', description: '', keywords: '', banners, page: 'banners' });
});
router.get('/banners/new', isAdmin, (req, res) => {
  res.render('admin/banner-form', { title: 'Add Banner', description: '', keywords: '', banner: null, page: 'banners' });
});
router.post('/banners', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === 'true' };
    if (req.file) data.image = '/uploads/' + req.file.filename;
    await Banner.create(data);
    req.flash('success', 'Banner added successfully');
    res.redirect('/admin/banners');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/banners/new'); }
});
router.get('/banners/:id/edit', isAdmin, async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  res.render('admin/banner-form', { title: 'Edit Banner', description: '', keywords: '', banner, page: 'banners' });
});
router.put('/banners/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === 'true' };
    if (req.file) data.image = '/uploads/' + req.file.filename;
    await Banner.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Banner updated');
    res.redirect('/admin/banners');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/banners'); }
});
router.delete('/banners/:id', isAdmin, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  req.flash('success', 'Banner deleted');
  res.redirect('/admin/banners');
});
// ─── Contacts ──────────────────────────────────────────────────────────────
router.get('/contacts', isAdmin, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  await Contact.updateMany({ isRead: false }, { isRead: true });
  res.render('admin/contacts', { title: 'Contact Messages', description: '', keywords: '', contacts, page: 'admin' });
});
router.delete('/contacts/:id', isAdmin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  req.flash('success', 'Message deleted');
  res.redirect('/admin/contacts');
});

module.exports = router;
