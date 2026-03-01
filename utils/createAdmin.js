require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garudclasses')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error(err); process.exit(1); });

async function createAdmin() {
  try {
    await Admin.deleteMany({});                        // wipe old admins first
    const admin = new Admin({ email: 'admin@garudclasses.com', role: 'admin' });
    await Admin.register(admin, 'Garud@Admin2024');    // hashes & stores password
    console.log('✅ Admin created!');
    console.log('   Email:    admin@garudclasses.com');
    console.log('   Password: Garud@Admin2024');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
