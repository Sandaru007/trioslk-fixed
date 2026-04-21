const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return emailRegex.test(value);
        },
        message: 'Please enter a valid email address',
      },
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },

    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Resolved'],
    },

    reply: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);