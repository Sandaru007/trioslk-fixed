const Lecturer = require('../models/Lecturer');

// @desc    Add new lecturer
// @route   POST /api/employees
const addLecturer = async (req, res) => {
  try {
    // --- ID GENERATION LOGIC START ---
    // Count how many lecturers are currently in the database
    const totalLecturers = await Lecturer.countDocuments();
    
    // Create the ID (e.g., if total is 0, first ID is LEC0001)
    const newId = `LEC${(totalLecturers + 1).toString().padStart(4, '0')}`;
    
    // Add the generated ID to the request body before creating the lecturer
    const lecturerData = { ...req.body, lecturerId: newId };
    // --- ID GENERATION LOGIC END ---

    const newLecturer = new Lecturer(lecturerData);
    const saved = await newLecturer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all staff
// @route   GET /api/employees
const getLecturers = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      return res.json([
        { _id: 'mock1', fullName: 'John Doe', email: 'john@example.com' },
        { _id: 'mock2', fullName: 'Jane Smith', email: 'jane@example.com' }
      ]);
    }
    const lecturers = await Lecturer.find();
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update lecturer details
// @route   PUT /api/employees/:id
const updateLecturer = async (req, res) => {
  console.log("PUT Request Body:", req.body); // <--- Add this!
  try {
    const updated = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Export all functions together at the bottom!
module.exports = {
  addLecturer,
  getLecturers,
  updateLecturer
};