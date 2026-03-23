const Student = require('../models/Student');

// @desc    Get total student count (FOR DASHBOARD STATS)
// @route   GET /api/students/count
const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching count', error: error.message });
  }
};

// @desc    Get all students (FOR UDARI'S MASTER LIST)
// @route   GET /api/students
const getAllStudents = async (req, res) => {
  try {
    // We sort by newest first and hide passwords for security
    const students = await Student.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// @desc    Update Student Status (FOR DEACTIVATE/DELETE TASK)
// @route   PUT /api/students/:id/status
const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'Active' or 'Inactive'
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: `Student is now ${status}`, student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  getStudentCount, 
  getAllStudents, 
  updateStudentStatus 
};