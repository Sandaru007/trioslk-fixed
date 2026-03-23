const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  lecturerId: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: [String], // Array: ['React', 'Node']
  qualifications: [String],
  availability: { type: String, default: 'Available' }, // e.g., 'Full-time', 'Weekends'
  status: { type: String, enum: ['Active', 'Resigned'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lecturer', LecturerSchema);