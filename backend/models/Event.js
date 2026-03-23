const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Online', 'Physical'] // Restricts input to only these two options
  },
  status: { 
    type: String, 
    default: 'Upcoming',
    enum: ['Upcoming', 'Ongoing', 'Completed'] 
  },
  imageUrl: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);