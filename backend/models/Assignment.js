const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  courseCode: { type: String, required: true },
  dueDate: { type: Date, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Who uploaded it
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
