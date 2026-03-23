const Inquiry = require('../models/Inquiry');

// CREATE inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    const inquiry = await Inquiry.create({
      name,
      email,
      category,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting inquiry',
      error: error.message,
    });
  }
};

// GET all inquiries (for admin later)
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries',
      error: error.message,
    });
  }
};