const Inquiry = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');

// CREATE inquiry (user side)
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

// GET all inquiries (admin)
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

// 🔥 NEW: REPLY to inquiry (ADMIN)
exports.replyInquiry = async (req, res) => {
  try {
    const { reply } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Save reply in DB
    inquiry.reply = reply;
    inquiry.status = 'Resolved';
    await inquiry.save();

    // 🔥 Send email to user
    await sendEmail({
      to: inquiry.email,
      subject: 'Reply to your inquiry - TriosLK Academy',
      text: `
Hello ${inquiry.name},

We have replied to your inquiry:

Your Message:
${inquiry.message}

Our Reply:
${reply}

Thank you,
TriosLK Academy Team
      `,
    });

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error replying to inquiry',
      error: error.message,
    });
  }
};

// DELETE inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting inquiry',
      error: error.message,
    });
  }
};