const Feedback = require('../models/Feedback');

// CREATE feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, course, rating, comment, recommend } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      course,
      rating,
      comment,
      recommend,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message,
    });
  }
};

// GET all feedback (for admin later)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
};