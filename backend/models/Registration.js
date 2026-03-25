const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Link to the specific Event using your manual ID
  eventCustomId: { 
    type: String, 
    required: true,
    ref: 'Event' 
  },
  // Link to the Student using their STU-XXXX ID
  studentCustomId: { 
    type: String, 
    required: true,
    ref: 'Student'
  },
  // Capturing these at the time of registration for quick access
  studentName: String,
  studentEmail: String,
  studentPhone: String,
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

registrationSchema.index({ eventCustomId: 1, studentCustomId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);