const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  // Personal Info
  fullName: { type: String, required: true },
  nic: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  
  // Contact Info
  email: { type: String, required: true },
  primaryPhone: { type: String, required: true },
  secondaryPhone: { type: String },
  address: { type: String, required: true },
  
  // Emergency Contact
  emergencyContactName: { type: String, required: true },
  emergencyRelationship: { type: String, required: true },
  emergencyPhone: { type: String, required: true },
  
  // Preferences
  primaryArea: { type: String, required: true },
  availability: { type: String, required: true }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model('Volunteer', volunteerSchema);