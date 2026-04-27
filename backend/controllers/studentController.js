const Student = require('../models/Student');
const Payment = require('../models/Payment');

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

// @desc    Get a specific student by ID (FOR PROFILE)
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

// @desc    Update Student Profile (including optional profilePhoto)
// @route   PUT /api/students/:id/profile
const updateStudentProfile = async (req, res) => {
  console.log('Update Profile Request for ID:', req.params.id);
  console.log('Body:', req.body);
  console.log('File:', req.file ? { filename: req.file.filename, path: req.file.path } : 'No file');
  try {
    const updateData = { ...req.body };
    
    // If multer processed a file, save the relative path for static hosting
    if (req.file) {
      updateData.profilePhoto = req.file.filename ? `/uploads/${req.file.filename}` : req.file.path;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Profile updated successfully', student });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};

// @desc    Get enrolled courses for a student
// @route   GET /api/students/:id/courses
const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.params.id; // STU-XXXX
    const studentIdStr = studentId.trim();
    // Find payments for this student that are 'Completed'
    const payments = await Payment.find({ 
      studentId: new RegExp(`^${studentIdStr}$`, 'i'), 
      status: 'Completed' 
    }).populate('courseId');
    console.log(`Found ${payments.length} completed payments for ${studentId}`);
    
    // Extract unique courses
    const Course = require('../models/Course');
    
    // Extract unique courses
    const coursesMap = new Map();
    for (const payment of payments) {
      console.log(`Processing payment ${payment._id}, courseId: ${payment.courseId ? payment.courseId._id : 'null'}`);
      
      let courseData = payment.courseId;
      
      // If courseId populate failed, try to recover the course by title
      if (!courseData && payment.courseTitle) {
         courseData = await Course.findOne({ title: payment.courseTitle });
      }

      if (courseData && !coursesMap.has(courseData._id.toString())) {
        const courseObj = courseData.toObject ? courseData.toObject() : courseData;
        courseObj.paymentStatus = payment.status;
        courseObj.paymentDate = payment.date;
        coursesMap.set(courseData._id.toString(), courseObj);
      } else if (!courseData && !coursesMap.has(payment.courseTitle)) {
        // Absolute fallback if course truly no longer exists
        coursesMap.set(payment.courseTitle, {
           _id: payment._id,
           title: payment.courseTitle,
           paymentStatus: payment.status,
           paymentDate: payment.date
        });
      }
    }

    const enrolledCourses = Array.from(coursesMap.values());
    console.log(`Returning ${enrolledCourses.length} unique enrolled courses`);
    res.status(200).json(enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
};

module.exports = { 
  getStudentCount, 
  getAllStudents, 
  updateStudentStatus,
  getStudentById,
  updateStudentProfile,
  getEnrolledCourses
};