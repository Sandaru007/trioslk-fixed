const express = require('express');
const router = express.Router();

// 1. Import the functions from the authController (not the email utility!)
const { registerStudent, loginUser } = require('../controllers/authController');

// 2. Define the specific routes
router.post('/register/student', registerStudent);
router.post('/login', loginUser);

module.exports = router;