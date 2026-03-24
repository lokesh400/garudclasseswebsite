const mongoose = require('mongoose');

const quickLinkSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  url:      { type: String, required: true, trim: true },
  icon:     { type: String, trim: true, default: 'fas fa-angle-right' }, // Font Awesome class
  category: { type: String, enum: ['basic', 'banner'], default: 'basic' }, // 'basic' = footer; 'banner' = top announcement bar (max 1)
  order:    { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  openInNewTab: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('QuickLink', quickLinkSchema);
