const Registration = require('../models/Registration');

// @desc    Register a student for an event
// @route   POST /api/registrations
const registerForEvent = async (req, res) => {
  try {
    const { eventId, eventTitle, studentId, studentName, studentEmail, studentPhone } = req.body;

    // 1. Check if already registered
    const existing = await Registration.findOne({ eventCustomId: eventId, studentCustomId: studentId });
    if (existing) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // 2. Create registration with correct field names
    const newReg = await Registration.create({
      eventCustomId: eventId,
      studentCustomId: studentId,
      studentName,
      studentEmail,
      studentPhone
    });

    res.status(201).json({ success: true, data: newReg });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Get all registrants for a specific event (Admin Use)
// @route   GET /api/registrations/event/:eventId
const getEventRegistrants = async (req, res) => {
  try {
    const registrants = await Registration.find({ eventCustomId: req.params.eventId });
    res.json(registrants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrants' });
  }
};

module.exports = { registerForEvent, getEventRegistrants };