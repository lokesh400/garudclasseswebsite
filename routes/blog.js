const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    res.render('blog', {
      title: 'Blog | Garud Classes - Study Tips, News & Updates',
      description: 'Read latest articles, study tips, exam updates, and news from Garud Classes. Stay ahead in JEE, NEET, and Board exam preparation.',
      keywords: 'garud classes blog, study tips, JEE tips, NEET preparation, exam updates',
      blogs, page: 'blog'
    });
  } catch (err) {
    res.render('blog', { title: 'Blog | Garud Classes', description: '', keywords: '', blogs: [], page: 'blog' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.redirect('/blog');
    const related = await Blog.find({ isPublished: true, _id: { $ne: blog._id } }).sort({ publishedAt: -1 }).limit(3);
    res.render('blog-detail', {
      title: `${blog.title} | Garud Classes Blog`,
      description: blog.metaDescription || blog.excerpt || blog.content?.substring(0, 160),
      keywords: `garud classes, ${blog.tags?.join(', ')}`,
      blog, related, page: 'blog'
    });
  } catch (err) {
    res.redirect('/blog');
  }
});

module.exports = router;
