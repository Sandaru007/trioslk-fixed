const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

  courseCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    default: "3 Months"
  },
  shortDesc: {
    type: String,
    required: true
  },
  fullDesc: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: "bi-book" // Bootstrap icon class
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Upcoming', 'Closed'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);