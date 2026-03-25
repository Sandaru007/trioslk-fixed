const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, trim: true },
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name must not exceed 50 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name must not exceed 50 characters']
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
        return age >= 16 && age <= 120;
      },
      message: 'Student must be at least 16 years old'
    }
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    minlength: [5, 'Address must be at least 5 characters'],
    maxlength: [200, 'Address must not exceed 200 characters']
  },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^07\d{6,8}$/.test(value.replace(/\s/g, ''));
      },
      message: 'Phone must be in Sri Lankan format (07xxxxxx)'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(value) {
        return /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value);
      },
      message: 'Password must contain uppercase, lowercase, number, and special character'
    },
    select: false // Don't return password by default
  },
  parentName: { 
    type: String, 
    required: [true, 'Parent/Guardian name is required'],
    trim: true,
    minlength: [2, 'Parent name must be at least 2 characters'],
    maxlength: [50, 'Parent name must not exceed 50 characters']
  },
  parentPhone: { 
    type: String, 
    required: [true, 'Parent/Guardian phone is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^07\d{6,8}$/.test(value.replace(/\s/g, ''));
      },
      message: 'Parent phone must be in Sri Lankan format (07xxxxxx)'
    }
  },
  role: { type: String, default: 'student' }
}, { timestamps: true });

// Hash password before saving to the database
studentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password on login
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);