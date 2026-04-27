const Session = require('../models/Session');
const { generateMockZoomLink } = require('../utils/zoomService');

const createSession = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      console.log("Mock session created:", req.body);
      return res.status(201).json({ ...req.body, _id: 'mock_session_id', createdAt: new Date() });
    }
    const newSession = new Session(req.body);
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

// Generate Zoom link for a session
const generateZoomLink = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Simulate API call to Zoom
    const zoomData = await generateMockZoomLink(session.title);
    
    // Update session
    session.meetingLink = zoomData.join_url;
    await session.save();
    
    res.status(200).json({ message: 'Zoom link generated successfully', meetingLink: session.meetingLink });
  } catch (error) {
    res.status(500).json({ message: 'Error generating Zoom link', error: error.message });
  }
};

// Upload heavy video file for a session
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Save the relative URL so the frontend can access it via static serving
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    session.videoUrl = videoUrl;
    await session.save();

    res.status(200).json({ message: 'Video uploaded successfully', videoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { userId, userRole } = req.body;
    
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Add to attendance if not already present
    const alreadyAttended = session.attendance.find(a => a.userId.toString() === userId);
    
    if (!alreadyAttended) {
      session.attendance.push({
        userId,
        userModel: userRole,
        loginTime: new Date()
      });
      await session.save();
    }

    res.status(200).json({ message: 'Attendance marked', attendance: session.attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// Fetch sessions by Course
const getSessionsByCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const sessions = await Session.find({ courseCode: courseCode });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

// Fetch sessions by Lecturer
const getSessionsByLecturer = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const sessions = await Session.find({ hostedBy: lecturerId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

// Fetch all sessions (for testing/demo)
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

module.exports = { 
  createSession, 
  getSessionsByCourse, 
  generateZoomLink, 
  uploadVideo, 
  markAttendance,
  getSessionsByLecturer,
  getAllSessions
};