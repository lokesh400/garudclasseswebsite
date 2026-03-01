const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    const categories = ['CLASSROOM', 'EVENT', 'RESULT', 'FACULTY', 'INFRASTRUCTURE', 'OTHER'];
    res.render('gallery', {
      title: 'Gallery | Garud Classes - Campus, Events & Achievements',
      description: 'Explore the gallery of Garud Classes - our state-of-art classrooms, events, result celebrations, and infrastructure.',
      keywords: 'garud classes gallery, coaching class photos, campus photos, events',
      items, categories, selectedCategory: category || '', page: 'gallery'
    });
  } catch (err) {
    res.render('gallery', { title: 'Gallery | Garud Classes', description: '', keywords: '', items: [], categories: [], selectedCategory: '', page: 'gallery' });
  }
});

module.exports = router;
