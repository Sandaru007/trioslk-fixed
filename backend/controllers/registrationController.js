const Registration = require('../models/Registration');
const { validateEmail, validatePhone } = require('./validators'); // Import your existing validators

// @desc    Register a student or guest for an event
// @route   POST /api/registrations
const registerForEvent = async (req, res) => {
  try {
    const { 
      eventId, 
      studentId, 
      studentName, 
      studentEmail, 
      studentPhone 
    } = req.body;

    // 1. Determine Registration Type
    // If studentId exists and isn't 'GUEST', it's a student. Otherwise, it's a guest.
    const isGuest = !studentId || studentId === 'GUEST';
    const regType = isGuest ? 'guest' : 'student';
    const finalStudentId = isGuest ? 'GUEST' : studentId;

    // 2. Form Validations (Especially for Guests)
    const emailCheck = validateEmail(studentEmail);
    if (!emailCheck.isValid) {
      return res.status(400).json({ success: false, message: emailCheck.error });
    }

    const phoneCheck = validatePhone(studentPhone);
    if (!phoneCheck.isValid) {
      return res.status(400).json({ success: false, message: phoneCheck.error });
    }

    // 3. Prevent Duplicate Registration
    // For students: Check by studentCustomId + eventCustomId
    // For guests: Check by studentEmail + eventCustomId
    const query = isGuest 
      ? { eventCustomId: eventId, studentEmail: studentEmail }
      : { eventCustomId: eventId, studentCustomId: finalStudentId };

    const existing = await Registration.findOne(query);
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: isGuest 
          ? 'This email is already registered for this event.' 
          : 'You are already registered for this event.' 
      });
    }

    // 4. Create registration
    const newReg = await Registration.create({
      eventCustomId: eventId,
      studentCustomId: finalStudentId,
      registrationType: regType,
      studentName,
      studentEmail,
      studentPhone
    });

    res.status(201).json({ 
      success: true, 
      message: `Successfully registered as a ${regType}!`,
      data: newReg 
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// @desc    Get all registrants for a specific event (Admin Use)
// @route   GET /api/registrations/event/:eventId
const getEventRegistrants = async (req, res) => {
  try {
    // We sort by registrationType so students appear first, then guests
    const registrants = await Registration.find({ eventCustomId: req.params.eventId })
      .sort({ registrationType: 1, createdAt: -1 });
    res.json(registrants);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching registrants' });
  }
};

module.exports = { registerForEvent, getEventRegistrants };