const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // <--- CRITICAL: Forces all emails to lowercase automatically
    trim: true       // <--- CRITICAL: Removes accidental spaces 
  },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  parentName: { type: String, required: true, trim: true },
  parentPhone: { type: String, required: true, trim: true },
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