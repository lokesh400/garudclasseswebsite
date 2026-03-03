const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require('../models/Admin');
const Result = require('../models/Result');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Banner = require('../models/Banner');
const Background = require('../models/Background');
const PopupModal = require('../models/PopupModal');
const QuickLink = require('../models/QuickLink');
const { cloudinary, uploaders } = require('../utils/cloudinary');

// Helper: extract Cloudinary public_id from URL for deletion
const getPublicId = (url = '') => {
  if (!url || !url.includes('cloudinary')) return null;
  const parts = url.split('/');
  const file  = parts[parts.length - 1].split('.')[0];
  const folder = parts[parts.length - 2];
  return `garudclasses/${folder}/${file}`;
};

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
router.post('/results', isAdmin, uploaders.results.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = req.file.path;
    await Result.create(data);
    req.flash('success', 'Result added successfully');
    res.redirect('/admin/results');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/results/new'); }
});
router.get('/results/:id/edit', isAdmin, async (req, res) => {
  const result = await Result.findById(req.params.id);
  res.render('admin/result-form', { title: 'Edit Result', description: '', keywords: '', result, page: 'admin' });
});
router.put('/results/:id', isAdmin, uploaders.results.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = req.file.path;
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
router.post('/faculty', isAdmin, uploaders.faculty.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    data.achievements = req.body.achievements ? req.body.achievements.split('\n').filter(a => a.trim()) : [];
    if (req.file) data.photo = req.file.path;
    await Faculty.create(data);
    req.flash('success', 'Faculty added successfully');
    res.redirect('/admin/faculty');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/faculty/new'); }
});
router.get('/faculty/:id/edit', isAdmin, async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  res.render('admin/faculty-form', { title: 'Edit Faculty', description: '', keywords: '', faculty, page: 'admin' });
});
router.put('/faculty/:id', isAdmin, uploaders.faculty.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    data.achievements = req.body.achievements ? req.body.achievements.split('\n').filter(a => a.trim()) : [];
    if (req.file) data.photo = req.file.path;
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
router.post('/courses', isAdmin, uploaders.courses.single('banner'), async (req, res) => {
  try {
    const data = req.body;
    data.features = req.body.features ? req.body.features.split('\n').filter(f => f.trim()) : [];
    if (req.file) data.banner = req.file.path;
    await Course.create(data);
    req.flash('success', 'Course added');
    res.redirect('/admin/courses');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/courses/new'); }
});
router.get('/courses/:id/edit', isAdmin, async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('admin/course-form', { title: 'Edit Course', description: '', keywords: '', course, page: 'admin' });
});
router.put('/courses/:id', isAdmin, uploaders.courses.single('banner'), async (req, res) => {
  try {
    const data = req.body;
    data.features = req.body.features ? req.body.features.split('\n').filter(f => f.trim()) : [];
    if (req.file) data.banner = req.file.path;
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
router.post('/gallery', isAdmin, uploaders.gallery.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.path;
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
router.post('/blog', isAdmin, uploaders.blog.single('image'), async (req, res) => {
  try {
    const data = req.body;
    data.isPublished = req.body.isPublished === 'true';
    data.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [];
    if (req.file) data.image = req.file.path;
    await Blog.create(data);
    req.flash('success', 'Blog post added');
    res.redirect('/admin/blog');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/blog/new'); }
});
router.get('/blog/:id/edit', isAdmin, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('admin/blog-form', { title: 'Edit Blog Post', description: '', keywords: '', blog, page: 'admin' });
});
router.put('/blog/:id', isAdmin, uploaders.blog.single('image'), async (req, res) => {
  try {
    const data = req.body;
    data.isPublished = req.body.isPublished === 'true';
    data.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [];
    if (req.file) data.image = req.file.path;
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
router.post('/banners', isAdmin, uploaders.banners.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === 'true' };
    if (req.file) data.image = req.file.path;
    await Banner.create(data);
    req.flash('success', 'Banner added successfully');
    res.redirect('/admin/banners');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/banners/new'); }
});
router.get('/banners/:id/edit', isAdmin, async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  res.render('admin/banner-form', { title: 'Edit Banner', description: '', keywords: '', banner, page: 'banners' });
});
router.put('/banners/:id', isAdmin, uploaders.banners.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === 'true' };
    if (req.file) data.image = req.file.path;
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
// ─── Background Settings ──────────────────────────────────────────────────
const BG_SECTIONS = [
  { value: 'hero',    label: 'Hero / Home Banner' },
  { value: 'about',   label: 'About Section' },
  { value: 'courses', label: 'Courses Section' },
  { value: 'results', label: 'Results Section' },
  { value: 'faculty', label: 'Faculty Section' },
  { value: 'gallery', label: 'Gallery Section' },
  { value: 'blog',    label: 'Blog Section' },
  { value: 'contact', label: 'Contact Section' },
];
router.get('/background', isAdmin, async (req, res) => {
  const backgrounds = await Background.find().sort({ section: 1 });
  res.render('admin/backgrounds', { title: 'Background Settings', description: '', keywords: '', backgrounds, sections: BG_SECTIONS, page: 'background' });
});
router.get('/background/new', isAdmin, (req, res) => {
  res.render('admin/background-form', { title: 'Add Background', description: '', keywords: '', bg: null, sections: BG_SECTIONS, page: 'background' });
});
router.post('/background', isAdmin, uploaders.banners.single('imageUrl'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.imageUrl = req.file.path;
    const section = BG_SECTIONS.find(s => s.value === data.section);
    if (section) data.label = section.label;
    await Background.create(data);
    req.flash('success', 'Background saved successfully');
    res.redirect('/admin/background');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/background/new'); }
});
router.get('/background/:id/edit', isAdmin, async (req, res) => {
  const bg = await Background.findById(req.params.id);
  res.render('admin/background-form', { title: 'Edit Background', description: '', keywords: '', bg, sections: BG_SECTIONS, page: 'background' });
});
router.put('/background/:id', isAdmin, uploaders.banners.single('imageUrl'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.imageUrl = req.file.path;
    await Background.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Background updated');
    res.redirect('/admin/background');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/background'); }
});
router.delete('/background/:id', isAdmin, async (req, res) => {
  await Background.findByIdAndDelete(req.params.id);
  req.flash('success', 'Background deleted');
  res.redirect('/admin/background');
});

// ─── Popup Modal Settings ─────────────────────────────────────────────────
router.get('/popup-modal', isAdmin, async (req, res) => {
  let popup = await PopupModal.findOne();
  if (!popup) popup = await PopupModal.create({});
  res.render('admin/popup-modal', { title: 'Popup Modal Settings', description: '', keywords: '', popup, page: 'popup' });
});

router.post('/popup-modal', isAdmin, uploaders.popup.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === 'true' };
    if (req.file) data.image = req.file.path;
    let popup = await PopupModal.findOne();
    if (popup) {
      // If new image uploaded, delete old one from Cloudinary
      if (req.file && popup.image) {
        const pid = getPublicId(popup.image);
        if (pid) cloudinary.uploader.destroy(pid).catch(() => {});
      }
      await PopupModal.findByIdAndUpdate(popup._id, data);
    } else {
      await PopupModal.create(data);
    }
    req.flash('success', 'Popup modal updated');
    res.redirect('/admin/popup-modal');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/popup-modal'); }
});

// ─── Quick Links ──────────────────────────────────────────────────────────
router.get('/quick-links', isAdmin, async (req, res) => {
  try {
    const quickLinks = await QuickLink.find().sort({ category: 1, order: 1 });
    res.render('admin/quick-links', { title: 'Quick Links', description: '', keywords: '', quickLinks, page: 'quicklinks' });
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/dashboard'); }
});
router.get('/quick-links/new', isAdmin, async (req, res) => {
  try {
    const bannerExists = !!(await QuickLink.findOne({ category: 'banner' }));
    res.render('admin/quick-link-form', { title: 'Add Quick Link', description: '', keywords: '', quickLink: null, bannerExists, page: 'quicklinks' });
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/quick-links'); }
});
router.post('/quick-links', isAdmin, async (req, res) => {
  try {
    const category = req.body.category === 'banner' ? 'banner' : 'basic';
    const data = {
      title:        req.body.title,
      url:          req.body.url,
      icon:         req.body.icon || 'fas fa-angle-right',
      category,
      order:        parseInt(req.body.order) || 0,
      isActive:     req.body.isActive === 'true' || req.body.isActive === 'on',
      openInNewTab: req.body.openInNewTab === 'true' || req.body.openInNewTab === 'on',
    };
    // Banner is limited to one — remove any existing banner before creating
    if (category === 'banner') await QuickLink.deleteMany({ category: 'banner' });
    await QuickLink.create(data);
    req.flash('success', category === 'banner' ? 'Banner link saved (previous banner replaced)' : 'Quick link added');
    res.redirect('/admin/quick-links');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/quick-links/new'); }
});
router.get('/quick-links/:id/edit', isAdmin, async (req, res) => {
  try {
    const quickLink = await QuickLink.findById(req.params.id);
    const bannerExists = !!(await QuickLink.findOne({ category: 'banner', _id: { $ne: req.params.id } }));
    res.render('admin/quick-link-form', { title: 'Edit Quick Link', description: '', keywords: '', quickLink, bannerExists, page: 'quicklinks' });
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/quick-links'); }
});
router.put('/quick-links/:id', isAdmin, async (req, res) => {
  try {
    const category = req.body.category === 'banner' ? 'banner' : 'basic';
    const data = {
      title:        req.body.title,
      url:          req.body.url,
      icon:         req.body.icon || 'fas fa-angle-right',
      category,
      order:        parseInt(req.body.order) || 0,
      isActive:     req.body.isActive === 'true' || req.body.isActive === 'on',
      openInNewTab: req.body.openInNewTab === 'true' || req.body.openInNewTab === 'on',
    };
    // If switching to banner, remove any OTHER existing banner first
    if (category === 'banner') await QuickLink.deleteMany({ category: 'banner', _id: { $ne: req.params.id } });
    await QuickLink.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Quick link updated');
    res.redirect('/admin/quick-links');
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/quick-links'); }
});
router.delete('/quick-links/:id', isAdmin, async (req, res) => {
  try {
    await QuickLink.findByIdAndDelete(req.params.id);
    req.flash('success', 'Quick link deleted');
  } catch (err) { req.flash('error', err.message); }
  res.redirect('/admin/quick-links');
});

// ─── Contacts ──────────────────────────────────────────────────────────────
router.get('/contacts', isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const unreadContacts = await Contact.countDocuments({ isRead: false });
    res.render('admin/contacts', { title: 'Contact Messages', description: '', keywords: '', contacts, unreadContacts, page: 'admin' });
  } catch (err) { req.flash('error', err.message); res.redirect('/admin/dashboard'); }
});

// Return single contact as JSON (for modal – does NOT mark as read)
router.get('/contacts/:id/json', isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark a single contact message as read
router.post('/contacts/:id/mark-read', isAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    req.flash('success', 'Message marked as seen');
  } catch (err) { req.flash('error', err.message); }
  res.redirect('/admin/contacts');
});

router.delete('/contacts/:id', isAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    req.flash('success', 'Message deleted');
  } catch (err) { req.flash('error', err.message); }
  res.redirect('/admin/contacts');
});

module.exports = router;
