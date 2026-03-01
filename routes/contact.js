const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contact Us | Garud Classes - Admissions & Enquiry',
    description: 'Contact Garud Classes for admissions, course enquiry, or any information. Visit us, call us, or fill the enquiry form. We are here to help!',
    keywords: 'garud classes contact, admission enquiry, coaching admission, garud classes address',
    page: 'contact'
  });
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await Contact.create({ name, email, phone, subject, message });
    req.flash('success', 'Thank you! We will contact you soon.');
    res.redirect('/contact');
  } catch (err) {
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/contact');
  }
});

module.exports = router;
