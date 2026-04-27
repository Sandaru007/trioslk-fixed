const Assignment = require('../models/Assignment');

// 1. Upload a new assignment
exports.uploadAssignment = async (req, res) => {
  try {
    const { title, description, courseCode, dueDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Build the URL to access the file
    // Example: /uploads/assignments/assignment-1634567890123.pdf
    const fileUrl = `/uploads/assignments/${req.file.filename}`;

    const newAssignment = new Assignment({
      title,
      description,
      fileUrl,
      courseCode,
      dueDate,
      uploadedBy: req.user ? req.user._id : null // Assuming auth middleware sets req.user
    });

    await newAssignment.save();

    res.status(201).json({ message: 'Assignment uploaded successfully', assignment: newAssignment });

  } catch (error) {
    console.error('Error uploading assignment:', error);
    res.status(500).json({ error: 'Failed to upload assignment' });
  }
};

// 2. Get assignments by course code
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const assignments = await Assignment.find({ courseCode }).sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments for course:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

// 3. Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};
