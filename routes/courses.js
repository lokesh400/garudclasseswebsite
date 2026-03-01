const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ order: 1 });
    res.render('courses', {
      title: 'Courses | Garud Classes - JEE, NEET, Foundation & Board Coaching',
      description: 'Explore all courses at Garud Classes - JEE Main & Advanced, NEET UG, Foundation, Board Exam preparation, NTSE, and Olympiad coaching programs.',
      keywords: 'garud classes courses, JEE coaching, NEET coaching, foundation class, board coaching, NTSE coaching',
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
