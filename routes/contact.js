const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contact Garud Classes Palwal — Admissions, Enquiry & Location',
    description: 'Contact Garud Classes in Palwal, Haryana for JEE, NEET, Foundation & Board coaching admissions. Call +91 98969 13009, WhatsApp, or fill the enquiry form. Best institute near you in Palwal.',
    keywords: 'garud classes contact Palwal, admission enquiry Palwal coaching, best coaching Palwal contact, Garud Classes address Palwal, coaching admission Palwal Haryana',
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
