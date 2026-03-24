const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  image: { type: String },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  metaDescription: { type: String },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  if (this.isPublished && !this.publishedAt) this.publishedAt = new Date();
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
