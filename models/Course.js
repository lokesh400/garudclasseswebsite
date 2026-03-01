const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  category: { type: String, enum: ['JEE', 'NEET', 'FOUNDATION', 'BOARD', 'NTSE', 'OLYMPIAD', 'OTHER'], default: 'OTHER' },
  icon: { type: String, default: 'fas fa-book' },
  banner: { type: String },
  description: { type: String },
  shortDesc: { type: String },
  duration: { type: String },
  eligibility: { type: String },
  features: [{ type: String }],
  fee: { type: String },
  syllabus: [{ topic: String, subtopics: [String] }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

courseSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
