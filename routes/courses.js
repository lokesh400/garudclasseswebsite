const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ order: 1 });
    res.render('courses', {
      title: 'Courses at Garud Classes Palwal — JEE, NEET, Foundation & Board Coaching',
      description: 'Explore all coaching programs at Garud Classes Palwal — JEE Main & Advanced, NEET UG, Foundation (Class 8-10), Board Exam (11th-12th), NTSE & Olympiad coaching. Best courses in Palwal Haryana.',
      keywords: 'JEE coaching Palwal, NEET coaching Palwal, foundation coaching Palwal, board exam coaching Palwal, best coaching courses Palwal, 11th 12th coaching Palwal, NTSE coaching Palwal Haryana, garud classes courses',
      courses, page: 'courses'
    });
  } catch (err) {
    res.render('courses', { title: 'Courses | Garud Classes', description: '', keywords: '', courses: [], page: 'courses' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true });
    if (!course) return res.redirect('/courses');
    res.render('course-detail', {
      title: `${course.name} | Garud Classes`,
      description: course.shortDesc || course.description?.substring(0, 160),
      keywords: `${course.name}, garud classes ${course.name}, ${course.category} coaching`,
      course, page: 'courses'
    });
  } catch (err) {
    res.redirect('/courses');
  }
});

module.exports = router;
