const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const { registerVolunteer } = require('../controllers/volunteerController');

// This matches: POST /api/volunteers/register
router.post('/register', registerVolunteer);

// This matches: GET /api/volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    console.error("Fetch Volunteers Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Approve a volunteer: PUT /api/volunteers/:id/approve
router.put('/:id/approve', async (req, res) => {
  try {
    await Volunteer.findByIdAndUpdate(req.params.id, { status: 'Active' });
    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

// Delete a volunteer: DELETE /api/volunteers/:id
router.delete('/:id', async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;