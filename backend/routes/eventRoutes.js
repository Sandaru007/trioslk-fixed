const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent); // Our brand new update route!
router.delete('/:id', deleteEvent);

module.exports = router;