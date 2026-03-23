const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Helper to generate the JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new student & send email
// @route   POST /api/auth/register/student
const registerStudent = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user already exists
    const userExists = await Student.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    // 2. Generate the TRIOS26_X Student ID
    const currentYear = new Date().getFullYear().toString().slice(-2); // gets "26"
    const prefix = `TRIOS${currentYear}_`;

    // Find the latest student from this year to get the highest number
    const lastStudent = await Student.findOne({ studentId: new RegExp(`^${prefix}`) })
                                     .sort({ createdAt: -1 });

    let newNumber = 1;
    if (lastStudent && lastStudent.studentId) {
      const lastNumber = parseInt(lastStudent.studentId.split('_')[1]);
      if (!isNaN(lastNumber)) newNumber = lastNumber + 1;
    }
    
    const generatedId = `${prefix}${newNumber}`;

    // 3. Create the student in the database
    const student = await Student.create({
      ...req.body,
      studentId: generatedId
    });

    // 4. Send the Welcome Email with their ID
    const emailMessage = `
      <h2>Welcome to TrioSLK Academy!</h2>
      <p>Dear ${student.firstName},</p>
      <p>Your registration was successful. Please use the following Student ID to log into your portal:</p>
      <h3><strong>Your Student ID: ${student.studentId}</strong></h3>
      <p>We look forward to seeing you in class!</p>
    `;

    try {
      await sendEmail({ email: student.email, subject: 'Your TrioSLK Student ID', message: emailMessage });
    } catch (emailError) {
      console.error("Email failed to send:", emailError);
      // We still return success even if email fails, but you might want to log this
    }

    res.status(201).json({ success: true, message: 'Registration successful. Please check your email for your Student ID.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Universal Login (Students, Admins, Lecturers)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // --- DEBUGGING LOGS ---
    console.log("--- LOGIN ATTEMPT ---");
    console.log("Incoming Username:", `"${username}"`);
    console.log("Incoming Password:", `"${password}"`);
    console.log("ENV Expected Email:", `"${process.env.ADMIN_EMAIL}"`);
    console.log("ENV Expected Pass:", `"${process.env.ADMIN_PASS}"`);
    console.log("---------------------");

    // 1. CHECK FOR SUPER ADMIN FIRST (Now with .trim() safety!)
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim() : null;
    const adminPass = process.env.ADMIN_PASS ? process.env.ADMIN_PASS.trim() : null;
    const inputUser = username ? username.trim() : '';

    if (adminEmail && adminPass && inputUser === adminEmail && password === adminPass) {
      console.log("✅ Admin login successful!");
      return res.json({
        _id: 'super_admin_id',
        name: 'Super Admin',
        role: 'admin',
        token: generateToken('super_admin_id', 'admin') 
      });
    }

    // 2. CHECK FOR REGULAR STUDENTS
    const student = await Student.findOne({ studentId: inputUser });

    if (student && (await student.matchPassword(password))) {
      console.log("✅ Student login successful!");
      return res.json({
        _id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId,
        role: student.role,
        token: generateToken(student._id, student.role)
      });
    } else {
      console.log("❌ Login failed: Invalid ID or password");
      return res.status(401).json({ message: 'Invalid ID or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerStudent, loginUser };