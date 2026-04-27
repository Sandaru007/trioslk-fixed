const Lecturer = require('../models/Lecturer');
const sendEmail = require('../utils/sendEmail.js');
const { validateLecturerRegistration, hasValidationErrors } = require('../controllers/validators.js');

// @desc    Add new lecturer
// @route   POST /api/employees
const addLecturer = async (req, res) => {
  try {
    // 1. Validate Form Data
    const errors = validateLecturerRegistration(req.body);
    if (hasValidationErrors(errors)) {
      return res.status(400).json({ success: false, errors });
    }

    // 2. ID Generation Logic
    const totalLecturers = await Lecturer.countDocuments();
    const newId = `LEC${(totalLecturers + 1).toString().padStart(4, '0')}`;
    
    // 3. Prepare Data (Setting Password as NIC)
    const lecturerData = { 
      ...req.body, 
      lecturerId: newId,
      password: req.body.nic // Assign NIC as the temporary password
    };

    const newLecturer = new Lecturer(lecturerData);
    const saved = await newLecturer.save();

    // 4. Send Email with Credentials
    const emailOptions = {
      email: saved.email,
      subject: 'Welcome to TrioSLK Academy - Lecturer Credentials',
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4a90e2;">Welcome to the Team, ${saved.fullName}!</h2>
          <p>Your lecturer account has been successfully created. You can now login to your dashboard using the credentials below:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
            <p><strong>Login URL:</strong> http://localhost:5173/login</p>
            <p><strong>Lecturer ID:</strong> <span style="color: #e74c3c;">${newId}</span></p>
            <p><strong>Temporary Password:</strong> <span style="color: #e74c3c;">${saved.nic}</span></p>
          </div>
          <p style="margin-top: 20px;">Please ensure you change your password after your first login for security purposes.</p>
          <p>Regards,<br/><strong>TrioSLK Academy Admin Team</strong></p>
        </div>
      `
    };

    await sendEmail(emailOptions);

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Error in addLecturer:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all staff
// @route   GET /api/employees
const getLecturers = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      return res.json([
        { _id: 'mock1', fullName: 'John Doe', email: 'john@example.com' },
        { _id: 'mock2', fullName: 'Jane Smith', email: 'jane@example.com' }
      ]);
    }
    const lecturers = await Lecturer.find();
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update lecturer details
// @route   PUT /api/employees/:id
const updateLecturer = async (req, res) => {
  console.log("PUT Request Body:", req.body); // <--- Add this!
  try {
    const updated = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Export all functions together at the bottom!
module.exports = {
  addLecturer,
  getLecturers,
  updateLecturer
};