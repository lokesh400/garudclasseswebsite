const mongoose = require('mongoose');

const popupModalSchema = new mongoose.Schema({
  image:       { type: String, default: '' },
  heading:     { type: String, trim: true, default: 'Welcome to Garud Classes!' },
  subtext:     { type: String, trim: true, default: 'Admissions open for 2025–26. Limited seats available.' },
  buttonText:  { type: String, trim: true, default: 'Enroll Now' },
  buttonLink:  { type: String, trim: true, default: '/contact' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PopupModal', popupModalSchema);
