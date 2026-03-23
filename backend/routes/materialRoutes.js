const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterialsByCourse } = require('../controllers/materialController');

// 1. Import the upload config tool we made earlier!
const upload = require('../utils/uploadConfig'); 

// 2. Inject upload.single('file') right in the middle!
// This tells Express: "Let Multer read the file and the text data FIRST, then pass it to the controller"
router.post('/', upload.single('file'), uploadMaterial);

router.get('/course/:courseCode', getMaterialsByCourse);

module.exports = router;