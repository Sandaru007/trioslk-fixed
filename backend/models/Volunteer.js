const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  // Personal Info
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [50, 'Full name must not exceed 50 characters']
  },
  nic: { 
    type: String, 
    required: [true, 'NIC number is required'],
    trim: true,
    validate: {
      validator: function(value) {
        const cleanNIC = value.replace(/\s/g, '').toUpperCase();
        // Old format: 9 digits + V
        const oldNICRegex = /^\d{9}V$/;
        // New format: 12 digits
        const newNICRegex = /^\d{12}$/;
        return oldNICRegex.test(cleanNIC) || newNICRegex.test(cleanNIC);
      },
      message: 'NIC must be valid Sri Lankan format (9 digits + V or 12 digits)'
    }
  },
  dateOfBirth: { 
    type: Date, 
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        if (!value) return false;
        const today = new Date();
        let age = today.getFullYear() - value.getFullYear();
        const monthDiff = today.getMonth() - value.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
          age--;
        }
        return age >= 18 && age <= 120;
      },
      message: 'Volunteer must be at least 18 years old'
    }
  },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  
  // Contact Info
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  primaryPhone: { 
    type: String, 
    required: [true, 'Primary phone is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^07\d{6,8}$/.test(value.replace(/\s/g, ''));
      },
      message: 'Primary phone must be in Sri Lankan format (07xxxxxx)'
    }
  },
  secondaryPhone: { 
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        // Secondary phone is optional, but if provided must be valid
        if (!value || value === '') return true;
        return /^07\d{6,8}$/.test(value.replace(/\s/g, ''));
      },
      message: 'Secondary phone must be in Sri Lankan format (07xxxxxx)'
    }
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    minlength: [5, 'Address must be at least 5 characters'],
    maxlength: [200, 'Address must not exceed 200 characters']
  },
  
  // Emergency Contact
  emergencyContactName: { 
    type: String, 
    required: [true, 'Emergency contact name is required'],
    trim: true,
    minlength: [2, 'Emergency contact name must be at least 2 characters'],
    maxlength: [50, 'Emergency contact name must not exceed 50 characters']
  },
  emergencyRelationship: { 
    type: String, 
    required: [true, 'Emergency relationship is required'],
    trim: true,
    minlength: [2, 'Relationship must be at least 2 characters'],
    maxlength: [50, 'Relationship must not exceed 50 characters']
  },
  emergencyPhone: { 
    type: String, 
    required: [true, 'Emergency phone is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^07\d{6,8}$/.test(value.replace(/\s/g, ''));
      },
      message: 'Emergency phone must be in Sri Lankan format (07xxxxxx)'
    }
  },
  
  // Preferences
  primaryArea: { 
    type: String, 
    required: [true, 'Primary area is required'],
    enum: {
      values: ['event_management', 'photography_media', 'logistics', 'guest_relations'],
      message: 'Primary area must be a valid option'
    }
  },
  availability: { 
    type: String, 
    required: [true, 'Availability is required'],
    enum: {
      values: ['weekdays', 'weekends', 'both'],
      message: 'Availability must be weekdays, weekends, or both'
    }
  },

  status: { type: String, default: 'Pending', enum: ['Pending', 'Active', 'Rejected'] }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model('Volunteer', volunteerSchema);