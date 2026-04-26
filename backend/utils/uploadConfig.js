const multer = require('multer');
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Tell Cloudinary who you are (Uses your .env keys)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Define WHERE to save the files (Cloudinary Folder)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'trioslk_materials',
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'docx', 'pptx'],
  // resource_type is handled differently in v2 or not needed if using auto in Cloudinary
});

// 3. Initialize Multer with this storage
const upload = multer({ storage: storage });

module.exports = upload;