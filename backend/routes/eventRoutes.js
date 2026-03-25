const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const upload = require('../utils/uploadConfig');

router.get('/', getEvents);
router.post('/', upload.single('imageFile'), createEvent);
router.put('/:id', upload.single('imageFile'), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;