const express = require('express');
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  showFeedbackOnHomepage,
  deleteFeedback,
  getHomepageFeedback,
} = require('../controllers/feedbackController');

// User submits feedback
router.post('/', createFeedback);

// Admin: get all feedback
router.get('/', getAllFeedback);

// Homepage: get only visible feedback
router.get('/homepage', getHomepageFeedback);

// Admin: show feedback on homepage
router.put('/:id/show', showFeedbackOnHomepage);

// Admin: delete feedback
router.delete('/:id', deleteFeedback);

module.exports = router;