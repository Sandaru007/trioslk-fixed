const express = require('express');
const router = express.Router();
const uploadVideoMulter = require('../utils/upload');
const { 
  createSession, 
  getSessionsByCourse, 
  generateZoomLink, 
  uploadVideo, 
  markAttendance,
  getSessionsByLecturer,
  getAllSessions
} = require('../controllers/sessionController');

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/course/:courseCode', getSessionsByCourse);
router.get('/lecturer/:lecturerId', getSessionsByLecturer);

// New Routes for specific tasks
router.put('/:id/zoom', generateZoomLink);
router.post('/:id/video', uploadVideoMulter.single('video'), uploadVideo);
router.put('/:id/attendance', markAttendance);

module.exports = router;