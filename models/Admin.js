const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;

const adminSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  role:      { type: String, default: 'admin' },
}, { timestamps: true });

// passport-local-mongoose adds username, hash, salt fields + serialize/deserialize
// We use email as the username field
adminSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('Admin', adminSchema);
