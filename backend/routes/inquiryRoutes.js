const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getAllInquiries,
  replyInquiry,     // 🔥 NEW
  deleteInquiry,    // 🔥 NEW
} = require('../controllers/inquiryController');

// User submits inquiry
router.post('/', createInquiry);

// Admin gets all inquiries
router.get('/', getAllInquiries);

// 🔥 Admin reply to inquiry
router.put('/:id/reply', replyInquiry);

// 🔥 Admin delete inquiry
router.delete('/:id', deleteInquiry);

module.exports = router;