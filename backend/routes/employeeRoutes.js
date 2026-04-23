const express = require('express');
const router = express.Router();
const { addLecturer, getLecturers, updateLecturer } = require('../controllers/employeeController');

router.post('/', addLecturer);
router.get('/', getLecturers);
router.put('/:id', updateLecturer);

// Get specific lecturer by ID (Add this near your other routes)
router.get('/:id', async (req, res) => {
  try {
    // --- FIX: Use findById to match the MongoDB _id sent by the frontend ---
    const lecturer = await require('../models/Lecturer').findById(req.params.id);
    
    if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
    }
    
    // Don't send the password back!
    const { password, ...safeData } = lecturer._doc;
    res.json(safeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;