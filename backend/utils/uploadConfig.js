const multer = require('multer');
const cloudinary = require('cloudinary').v2;
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
  params: {
    folder: 'trioslk_materials', // Files will go into this folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'docx', 'pptx'],
    resource_type: 'auto' // Important: allows both images AND PDFs
  },
});

// 3. Initialize Multer with this storage
const upload = multer({ storage: storage });

module.exports = upload;