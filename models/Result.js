const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  fatherName: { type: String, trim: true },
  photo: { type: String, default: '/img/default-student.png' },
  exam: { type: String, required: true, trim: true },    // e.g. "JEE Mains 2024"
  rank: { type: String, trim: true },                    // e.g. "AIR 142"
  score: { type: String, trim: true },                   // e.g. "98.7%"
  percentile: { type: String, trim: true },
  year: { type: Number, required: true },
  category: { type: String, enum: ['JEE', 'NEET', 'BOARD', 'NTSE', 'OLYMPIAD', 'OTHER'], default: 'OTHER' },
  isBoardTopper: { type: Boolean, default: false },
  isStateTopper: { type: Boolean, default: false },
  testimonial: { type: String },
  batch: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
