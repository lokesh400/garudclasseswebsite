const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.find({ isActive: true }).sort({ order: 1 });
    res.render('faculty', {
      title: 'Our Faculty | Garud Classes Palwal — Expert IIT/NIT Alumni & Top Educators',
      description: 'Meet the expert faculty of Garud Classes Palwal — IIT/NIT alumni, experienced doctors, and top educators with proven coaching track records for JEE, NEET, and board exams in Palwal, Haryana.',
      keywords: 'garud classes faculty Palwal, IIT faculty Palwal, best teachers Palwal, coaching teachers Palwal Haryana, JEE faculty Palwal, NEET faculty Palwal',
      faculties, page: 'faculty'
    });
  } catch (err) {
    res.render('faculty', { title: 'Faculty | Garud Classes', description: '', keywords: '', faculties: [], page: 'faculty' });
  }
});

module.exports = router;
