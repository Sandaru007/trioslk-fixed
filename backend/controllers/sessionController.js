const Session = require('../models/Session');

// Lecturer schedules a new Zoom session
const createSession = async (req, res) => {
  try {
    const newSession = new Session(req.body);
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

// Student clicks on "TA101" -> Fetch only TA101 sessions
const getSessionsByCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const sessions = await Session.find({ courseCode: courseCode });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

module.exports = { createSession, getSessionsByCourse };