const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    default: 'New Student'
  },
  studentName: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseTitle: String,
  amount: Number,
  method: String,
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
