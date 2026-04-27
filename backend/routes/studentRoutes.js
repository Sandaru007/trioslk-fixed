const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const upload = require('../utils/uploadConfig');
const { 
  getStudentCount, 
  getAllStudents, 
  updateStudentStatus,
  getStudentById,
  updateStudentProfile,
  getEnrolledCourses
} = require('../controllers/studentController');

// Define the endpoints
router.get('/count', getStudentCount); 
router.get('/', getAllStudents);       
router.put('/:id/status', updateStudentStatus);

// Profile endpoints
router.get('/:id', getStudentById);
router.get('/:id/courses', getEnrolledCourses);
router.put('/:id/profile', upload.single('profilePhoto'), updateStudentProfile);

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete Student Error:", err);
    res.status(500).json({ message: "Server Error during deletion" });
  }
});

module.exports = router;