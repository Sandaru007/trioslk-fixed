const Volunteer = require('../models/Volunteer');
const { validateVolunteerRegistration } = require('./validators');

// @desc    Register a new volunteer
// @route   POST /api/volunteers/register
const registerVolunteer = async (req, res) => {
  try {
    // 1. Validate all input fields
    const validationErrors = validateVolunteerRegistration(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // 2. Check if email already exists
    const existingVolunteer = await Volunteer.findOne({ email: req.body.email });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errors: { email: 'Email already registered' }
      });
    }

    // 3. Create and save new volunteer
    const newVolunteer = new Volunteer(req.body);
    const savedVolunteer = await newVolunteer.save();
    
    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: savedVolunteer
    });
  } catch (error) {
    console.error("Error saving volunteer:", error);
    
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

    res.status(500).json({ success: false, message: 'Server Error. Please try again.' });
  }
};

module.exports = { registerVolunteer };