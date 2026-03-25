const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { validateStudentRegistration } = require('./validators');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new student (Auto-generates STU-XXXX ID)
// @route   POST /api/auth/register/student
const registerStudent = async (req, res) => {
  try {
    // 1. Validate all input fields
    const validationErrors = validateStudentRegistration(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validationErrors 
      });
    }

    const { email } = req.body;

    // 1. Check if student already exists
    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered',
        errors: { email: 'Email already registered' }
      });
    }

    // 3. Auto-generate Student ID (e.g., STU-1001)
    const lastStudent = await Student.findOne({ studentId: /^STU-/ }).sort({ createdAt: -1 });
    let newIdNumber = 1001;

    if (lastStudent && lastStudent.studentId) {
      const lastIdParts = lastStudent.studentId.split('-');
      if (lastIdParts.length === 2) {
        newIdNumber = parseInt(lastIdParts[1]) + 1;
      }
    }

    const generatedId = `STU-${newIdNumber}`;

    // 4. Create the student with validated data
    const student = await Student.create({
      ...req.body,
      studentId: generatedId
    });

    res.status(201).json({ 
      success: true, 
      message: `Registration successful! Your Student ID is ${generatedId}`,
      student 
    });

  } catch (error) {
    console.error("Register Error:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered',
        errors: { email: 'Email already registered' }
      });
    }

    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Universal Login
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check Admin
    if (username === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      return res.json({
        _id: 'admin',
        name: 'Super Admin',
        role: 'admin',
        token: generateToken('admin', 'admin')
      });
    }

    // 2. Check Student
    const student = await Student.findOne({ studentId: username });
    if (student && (await student.matchPassword(password))) {
      return res.json({
        _id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        role: 'student',
        token: generateToken(student._id, 'student')
      });
    }

    res.status(401).json({ message: 'Invalid ID or Password' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- CRITICAL: Export BOTH functions ---
module.exports = { 
  loginUser, 
  registerStudent 
};