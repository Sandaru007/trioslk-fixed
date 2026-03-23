const express = require('express');
const router = express.Router();
const { 
  getStudentCount, 
  getAllStudents, 
  updateStudentStatus 
} = require('../controllers/studentController');

// Define the endpoints
router.get('/count', getStudentCount); // http://localhost:8000/api/students/count
router.get('/', getAllStudents);       // http://localhost:8000/api/students
router.put('/:id/status', updateStudentStatus);

module.exports = router;