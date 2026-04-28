const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // <-- Moved to the top with the other imports
const connectDB = require('./config/db');

// Load environment variables (Do this before importing routes!)
dotenv.config();

// Connect to Database
connectDB();

// --- Import ALL Routes Here ---
const employeeRoutes = require('./routes/employeeRoutes');
const studentRoutes = require('./routes/studentRoutes'); 
const volunteerRoutes = require('./routes/volunteerRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes'); 
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const materialRoutes = require('./routes/materialRoutes');
const sessionRoutes = require('./routes/sessionRoutes'); 
const feedbackRoutes = require('./routes/feedbackRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Allows us to send/receive JSON
app.use(express.urlencoded({ extended: true })); // <-- NEW: Crucial for parsing FormData and files!

// Serve uploads folder (Only need this once!)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Endpoints (shows the server where to send specific requests.) ---
app.use('/api/employees', employeeRoutes);
app.use('/api/students', studentRoutes); 
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/courses', courseRoutes); 
app.use('/api/events', eventRoutes); 
app.use('/api/registrations', registrationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/assignments', assignmentRoutes);

app.get('/', (req, res) => {
  res.send('TrioSLK API is running...');
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  const error = err || new Error('Unknown Error');
  console.error('SERVER ERROR:', error.stack || error.message || error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? (error.stack || error) : undefined
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Catch unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.stack);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.stack);
  // Optional: process.exit(1); 
});