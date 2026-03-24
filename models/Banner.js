const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  subtitle:    { type: String, trim: true },
  image:       { type: String, required: true },
  buttonText:  { type: String, trim: true, default: 'Learn More' },
  buttonLink:  { type: String, trim: true, default: '/courses' },
  bgColor:     { type: String, default: '#1d3557' }, // overlay tint fallback
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
