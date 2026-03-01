const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },  // e.g. "Senior Physics Faculty"
  subject: { type: String, required: true, trim: true },
  photo: { type: String, default: '/img/default-faculty.png' },
  qualification: { type: String, trim: true },                // e.g. "B.Tech IIT Delhi, M.Tech"
  experience: { type: String, trim: true },                   // e.g. "12+ Years"
  about: { type: String },
  achievements: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faculty', facultySchema);
