const express = require('express');
const router = express.Router();

// Dedicated SEO page for NDA Coaching
router.get('/nda-coaching', (req, res) => {
  res.render('nda-coaching', {
    title: 'Best NDA Coaching in Palwal & Faridabad | Join Garud Classes',
    description: 'Looking for the best NDA coaching in Palwal and Faridabad? Garud Classes offers expert guidance, physical training tips, and comprehensive syllabus coverage to crack the NDA exam.',
    keywords: 'NDA coaching in Palwal, best NDA coaching in Faridabad, NDA preparation, join NDA coaching near me, NDA written exam coaching, top NDA institute Haryana, Garud Classes NDA',
    page: 'courses'
  });
});

// Dedicated SEO page for Faridabad Coaching
router.get('/faridabad-coaching', (req, res) => {
  res.render('faridabad-coaching', {
    title: 'Best Coaching Institute in Faridabad | JEE, NEET, NDA, Foundation — Garud Classes',
    description: 'Garud Classes is the top-ranked coaching institute serving Faridabad. We offer premier classes for JEE Main, JEE Advanced, NEET UG, NDA, and Foundation (Class 8-10).',
    keywords: 'best coaching institute in Faridabad, top NEET coaching in Faridabad, best JEE coaching Faridabad, NDA coaching Faridabad, Foundation coaching Faridabad, coaching near me Faridabad, Garud Classes Faridabad',
    page: 'home'
  });
});

module.exports = router;
