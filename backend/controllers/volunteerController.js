const Volunteer = require('../models/Volunteer');

// @desc    Register a new volunteer
// @route   POST /api/volunteers/register
const registerVolunteer = async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    const savedVolunteer = await newVolunteer.save();
    
    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: savedVolunteer
    });
  } catch (error) {
    console.error("Error saving volunteer:", error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' });
  }
};

module.exports = { registerVolunteer };