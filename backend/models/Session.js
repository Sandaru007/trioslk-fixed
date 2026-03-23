const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  date: { type: String, required: true },
  time: { type: String, required: true },
  meetingLink: { type: String, required: true }, // Zoom link
  courseCode: { type: String, required: true }, 
  hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);