const mongoose = require('mongoose');

const backgroundSchema = new mongoose.Schema({
  section:         { type: String, required: true, unique: true,
                     enum: ['hero', 'about', 'courses', 'results', 'faculty', 'gallery', 'blog', 'contact'] },
  label:           { type: String, default: '' },       // friendly display name
  imageUrl:        { type: String, default: '' },        // Cloudinary CDN URL
  bgColor:         { type: String, default: '#f8f9fa' }, // fallback solid colour
  gradient:        { type: String, default: '' },        // optional CSS gradient string
  overlayOpacity:  { type: Number, default: 0.5, min: 0, max: 1 },
  overlayColor:    { type: String, default: '#000000' },
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Background', backgroundSchema);
