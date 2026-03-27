const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { 
    type: String, 
    unique: true, 
    sparse: true,
    required: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['Online', 'Physical']
  },
  status: { 
    type: String, 
    default: 'Upcoming',
    enum: ['Upcoming', 'Ongoing', 'Extended', 'Completed']
  },
  imageFile: { 
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);