const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Banner = require('../models/Banner');
const PopupModal = require('../models/PopupModal');

// Home Page
router.get('/', async (req, res) => {
  try {
    const [topResults, faculties, courses, blogs, banners, popup] = await Promise.all([
      Result.find().sort({ year: -1 }).limit(6),
      Faculty.find({ isActive: true }).sort({ order: 1 }).limit(8),
      Course.find({ isActive: true }).sort({ order: 1 }),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3),
      Banner.find({ isActive: true }).sort({ order: 1 }),
      PopupModal.findOne()
    ]);
    res.render('index', {
      title: 'Garud Classes Palwal — No. 1 Coaching Institute for JEE, NEET & Board Exams',
      description: 'Garud Classes is the best coaching institute in Palwal, Haryana for JEE Main & Advanced, NEET UG, Foundation (Class 8-10), Board Exams, NTSE & Olympiads. Top-ranked institute near you in Palwal. Enroll now!',
      keywords: 'best coaching institute in Palwal, no 1 institute in Palwal, best JEE coaching Palwal, best NEET coaching Palwal, coaching near me Palwal, top institute Palwal Haryana, JEE coaching Palwal, NEET coaching Palwal, garud classes, coaching institute Palwal, best institute near me Palwal, 11th 12th coaching Palwal, foundation classes Palwal, NTSE coaching Palwal',
      topResults, faculties, courses, blogs, banners,
      popup: popup && popup.isActive ? popup : null,
      page: 'home'
    });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Garud Classes', description: '', keywords: '', topResults: [], faculties: [], courses: [], blogs: [], banners: [], popup: null, page: 'home' });
  }
});

// About Page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Garud Classes Palwal — Best Coaching Institute in Palwal Haryana',
    description: 'Learn about Garud Classes — the No. 1 coaching institute in Palwal, Haryana. Our mission, faculty, infrastructure, and track record of success in JEE, NEET and Board Exams since our founding.',
    keywords: 'about garud classes, best institute Palwal, coaching institute Palwal about, garud classes Palwal history, No 1 institute Palwal',
    page: 'about'
  });
});

// SEO Landing Page — Best Coaching in Palwal
router.get('/best-coaching-in-palwal', (req, res) => {
  res.render('palwal-coaching', {
    title: 'Best Coaching Institute in Palwal | No. 1 JEE NEET Coaching Palwal — Garud Classes',
    description: 'Garud Classes is the No. 1 and best coaching institute in Palwal, Haryana for JEE Main, JEE Advanced, NEET UG, Foundation, Board Exams & NTSE. Top-ranked institute near you. Enroll today!',
    keywords: 'best coaching institute in Palwal, no 1 institute Palwal, best institute near me Palwal, best JEE institute near me Palwal, best NEET coaching Palwal, top coaching Palwal Haryana, JEE coaching Palwal, NEET coaching Palwal, coaching near me Palwal, best 11th 12th coaching Palwal, foundation classes Palwal, coaching institute Palwal Haryana',
    page: 'home'
  });
});

// Sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    const blogs = await Blog.find({ isPublished: true });
    const siteUrl = process.env.SITE_URL;
    
    let urls = [
      { loc: siteUrl, priority: '1.0', changefreq: 'daily' },
      { loc: `${siteUrl}/best-coaching-in-palwal`, priority: '1.0', changefreq: 'weekly' },
      { loc: `${siteUrl}/about`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${siteUrl}/courses`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${siteUrl}/results`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${siteUrl}/faculty`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${siteUrl}/gallery`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'daily' },
      { loc: `${siteUrl}/contact`, priority: '0.7', changefreq: 'monthly' }
    ];
    
    courses.forEach(c => urls.push({ loc: `${siteUrl}/courses/${c.slug}`, priority: '0.8', changefreq: 'monthly' }));
    blogs.forEach(b => urls.push({ loc: `${siteUrl}/blog/${b.slug}`, priority: '0.7', changefreq: 'monthly' }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
