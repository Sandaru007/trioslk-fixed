const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  date: { type: String, required: true },
  time: { type: String, required: true },
  meetingLink: { type: String, required: false }, // Zoom link
  courseCode: { type: String, required: true }, 
  hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  videoUrl: { type: String, required: false },
  attendance: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      userModel: { type: String, required: true, enum: ['Student', 'Employee'] },
      loginTime: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);