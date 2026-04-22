const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  accessLevel: { type: String, enum: ['Lecturer', 'Senior Lecturer', 'Admin'], default: 'Lecturer' },
  lecturerId: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nic: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  specialization: [String], // Array: ['React', 'Node']
  qualifications: [String],
  availability: { type: String, default: 'Available' }, // e.g., 'Full-time', 'Weekends'
  status: { type: String, enum: ['Active', 'Resigned'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Lecturer', LecturerSchema);