const express = require('express');
const router = express.Router();
const { createSession, getSessionsByCourse } = require('../controllers/sessionController');

router.post('/', createSession);
router.get('/course/:courseCode', getSessionsByCourse);

module.exports = router;