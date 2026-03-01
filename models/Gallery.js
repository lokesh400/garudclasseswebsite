const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, trim: true },
  image: { type: String, required: true },
  category: { type: String, enum: ['CLASSROOM', 'EVENT', 'RESULT', 'FACULTY', 'INFRASTRUCTURE', 'OTHER'], default: 'OTHER' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);
