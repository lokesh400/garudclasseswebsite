const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// One storage per folder so images are organized in Cloudinary
const makeStorage = (folder, transformation) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `garudclasses/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
      transformation: transformation || [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    }
  })

const uploaders = {
  results: multer({
    storage: makeStorage('results'),
    limits: { fileSize: 5 * 1024 * 1024 }
  }),
  faculty: multer({
    storage: makeStorage('faculty'),
    limits: { fileSize: 5 * 1024 * 1024 }
  }),
  courses: multer({
    storage: makeStorage('courses'),
    limits: { fileSize: 5 * 1024 * 1024 }
  }),
  gallery: multer({
    storage: makeStorage('gallery'),
    limits: { fileSize: 5 * 1024 * 1024 }
  }),
  blog: multer({
    storage: makeStorage('blog'),
    limits: { fileSize: 5 * 1024 * 1024 }
  }),
  banners: multer({
    storage: makeStorage('banners', [
      {
        width: 1400,
        height: 500,
        crop: 'fit',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ]),
    limits: { fileSize: 5 * 1024 * 1024 }
  }),
  popup: multer({
    storage: makeStorage('popup'),
    limits: { fileSize: 5 * 1024 * 1024 }
  })
}

module.exports = { cloudinary, uploaders }
