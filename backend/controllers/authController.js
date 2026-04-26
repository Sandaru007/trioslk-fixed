const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
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

    // 5. Send welcome email with Student ID
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
            .email-card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo-text { font-size: 24px; font-weight: bold; color: #7a1b29; }
            .welcome-msg { font-size: 20px; color: #1f2937; margin-bottom: 20px; font-weight: 600; }
            .student-id-box { background: linear-gradient(135deg, #7a1b29 0%, #c63a31 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; }
            .student-id-label { font-size: 14px; opacity: 0.9; margin-bottom: 10px; }
            .student-id-value { font-size: 36px; font-weight: bold; letter-spacing: 2px; font-family: 'Courier New', monospace; }
            .info-section { margin: 25px 0; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #7a1b29; border-radius: 4px; }
            .info-title { font-weight: 600; color: #7a1b29; margin-bottom: 8px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            .cta-button { display: inline-block; background-color: #7a1b29; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-card">
              <div class="logo">
                <div class="logo-text">TrioSLK Academy</div>
                <p style="color: #6b7280; margin: 5px 0 0 0;">Learning Management System</p>
              </div>

              <div class="welcome-msg">Welcome to TrioSLK Academy! 🎉</div>
              <p>Dear ${student.firstName} ${student.lastName},</p>
              <p>Thank you for registering with TrioSLK Academy. Your student account has been successfully created. Below is your unique Student ID that you'll use to log in and access all our learning resources.</p>

              <div class="student-id-box">
                <div class="student-id-label">YOUR STUDENT ID</div>
                <div class="student-id-value">${generatedId}</div>
              </div>

              <div class="info-section">
                <div class="info-title">📋 Your Account Information</div>
                <p style="margin: 0;">
                  <strong>Email:</strong> ${student.email}<br>
                  <strong>Name:</strong> ${student.firstName} ${student.lastName}<br>
                  <strong>Student ID:</strong> ${generatedId}
                </p>
              </div>

              <div class="info-section">
                <div class="info-title">🚀 Next Steps</div>
                <ol style="margin: 0; padding-left: 20px;">
                  <li>Log in to the LMS using your Student ID and password</li>
                  <li>Complete your profile setup</li>
                  <li>Enroll in your courses</li>
                  <li>Start learning!</li>
                </ol>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you didn't create this account or need any assistance, please contact our support team immediately.</p>

              <div class="footer">
                <p style="margin: 0;">&copy; 2024 TrioSLK Academy. All rights reserved.</p>
                <p style="margin: 8px 0 0 0;">Questions? Contact us at support@trioslk.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email asynchronously (don't block the response)
    sendEmail({
      email: student.email,
      subject: `Welcome to TrioSLK Academy - Your Student ID: ${generatedId}`,
      message: emailTemplate
    }).then(result => {
      if (result.success) {
        console.log(`✓ Welcome email sent to ${student.email}`);
      } else {
        console.warn(`⚠ Failed to send welcome email to ${student.email}: ${result.error}`);
      }
    }).catch(err => {
      console.error(`⚠ Error sending welcome email: ${err.message}`);
    });

    res.status(201).json({ 
      success: true, 
      message: `Registration successful! Your Student ID is ${generatedId}. Welcome email has been sent to ${student.email}`,
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

    // 2. Check Lecturer (IDs starting with LEC)
    if (username.startsWith('LEC')) {
      const lecturer = await Lecturer.findOne({ lecturerId: username });
      // Since we used NIC as password, we check plain text here
      if (lecturer && lecturer.nic === password) {
        if (lecturer.status === 'Resigned') {
           return res.status(403).json({ message: 'Account deactivated. Contact Admin.' });
        }
        return res.json({
          _id: lecturer._id,
          name: lecturer.fullName,
          role: 'lecturer',
          token: generateToken(lecturer._id, 'lecturer')
        });
      }
    }

    // 3. Check Student
    const student = await Student.findOne({ studentId: username }).select('+password');
    if (student && (await student.matchPassword(password))) {
      return res.json({
        _id: student._id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
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