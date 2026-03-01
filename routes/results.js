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
      title: 'Results | Garud Classes - JEE, NEET, Board Toppers',
      description: 'View outstanding results of Garud Classes students in JEE, NEET, Board Exams, NTSE and Olympiads. Our students consistently top nationwide.',
      keywords: 'garud classes results, JEE result, NEET result, board topper, garud classes toppers',
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
