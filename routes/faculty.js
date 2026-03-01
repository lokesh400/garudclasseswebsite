const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.find({ isActive: true }).sort({ order: 1 });
    res.render('faculty', {
      title: 'Our Faculty | Garud Classes - Expert IITians, Doctors & Educators',
      description: 'Meet the experienced and dedicated faculty of Garud Classes. Our teachers are IIT/NIT alumni, doctors, and top educators with years of coaching experience.',
      keywords: 'garud classes faculty, IIT faculty, best teachers, coaching faculty, garud classes teachers',
      faculties, page: 'faculty'
    });
  } catch (err) {
    res.render('faculty', { title: 'Faculty | Garud Classes', description: '', keywords: '', faculties: [], page: 'faculty' });
  }
});

module.exports = router;
