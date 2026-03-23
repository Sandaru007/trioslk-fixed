const express = require('express');
const router = express.Router();
const { addLecturer, getLecturers, updateLecturer } = require('../controllers/employeeController');

router.post('/', addLecturer);
router.get('/', getLecturers);
router.put('/:id', updateLecturer);

module.exports = router;