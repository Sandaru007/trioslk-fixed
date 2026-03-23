const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getAllInquiries,
} = require('../controllers/inquiryController');

router.post('/', createInquiry);
router.get('/', getAllInquiries);

module.exports = router;