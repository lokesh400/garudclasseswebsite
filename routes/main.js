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
      title: 'Garud Classes - Best Coaching Institute for JEE, NEET, Foundation',
      description: 'Garud Classes is a premier coaching institute offering expert coaching for JEE, NEET, Board Exams, NTSE, and Olympiads. Join thousands of successful students.',
      keywords: 'garud classes, coaching institute, JEE coaching, NEET coaching, best coaching, garudclasses.com',
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
    title: 'About Us | Garud Classes - Our Story, Mission & Vision',
    description: 'Know about Garud Classes - our history, mission, vision, infrastructure and why we are the best coaching institute. Trusted by thousands of students.',
    keywords: 'about garud classes, coaching institute about, garud classes history',
    page: 'about'
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
