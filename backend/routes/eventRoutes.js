const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getPublicEvents, // Ensure this is imported
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const upload = require('../utils/uploadConfig');

// 1. PUBLIC ROUTE (Must be ABOVE /:id routes)
router.get('/public', getPublicEvents); 

// 2. ADMIN ROUTE (All events)
router.get('/', getEvents);

// 3. ACTION ROUTES
router.post('/', upload.single('imageFile'), createEvent);
router.put('/:id', upload.single('imageFile'), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;