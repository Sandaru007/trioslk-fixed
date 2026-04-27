const express = require('express');
const router = express.Router();
const { uploadAssignment, getAssignmentsByCourse, getAllAssignments } = require('../controllers/assignmentController');

const upload = require('../utils/uploadAssignmentConfig'); 

router.post('/', upload.single('file'), uploadAssignment);
router.get('/course/:courseCode', getAssignmentsByCourse);
router.get('/', getAllAssignments);

module.exports = router;
