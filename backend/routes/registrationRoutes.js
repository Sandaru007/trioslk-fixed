const express = require('express');
const router = express.Router();
const { registerForEvent, getEventRegistrants } = require('../controllers/registrationController');

router.post('/', registerForEvent);
router.get('/event/:eventId', getEventRegistrants);

module.exports = router;
