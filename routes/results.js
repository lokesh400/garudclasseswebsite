const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

router.get('/', async (req, res) => {
  try {
    const { year, category, exam } = req.query;
    let filter = {};
    if (year) filter.year = parseInt(year);
    if (category) filter.category = category;
    
    const years = await Result.distinct('year');
    const categories = ['JEE', 'NEET', 'BOARD', 'NTSE', 'OLYMPIAD', 'OTHER'];
    const results = await Result.find(filter).sort({ year: -1, rank: 1 });
    
    res.render('results', {
      title: 'Results | Garud Classes Palwal — JEE, NEET & Board Toppers from Palwal',
      description: 'See the outstanding JEE, NEET, Board & NTSE results of students at Garud Classes, the No. 1 coaching institute in Palwal Haryana. Our students consistently rank among the top across Haryana and India.',
      keywords: 'garud classes results Palwal, JEE result Palwal, NEET result Palwal, board topper Palwal, best coaching results Palwal Haryana, garud classes toppers',
      results, years: years.sort((a, b) => b - a), categories,
      selectedYear: year || '', selectedCategory: category || '',
      page: 'results'
    });
  } catch (err) {
    console.error(err);
    res.render('results', { title: 'Results | Garud Classes', description: '', keywords: '', results: [], years: [], categories: [], selectedYear: '', selectedCategory: '', page: 'results' });
  }
});

module.exports = router;
