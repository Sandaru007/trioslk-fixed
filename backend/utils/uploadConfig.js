const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Log in to Cloudinary using your .env secrets
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'trioslk_materials', // It will create this folder in your Cloudinary account!
    allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'zip'], // Acceptable file types
    resource_type: 'auto' // Important so it accepts both images AND raw files like PDFs
  },
});

// 3. Create the upload tool
const upload = multer({ storage: storage });

module.exports = upload;