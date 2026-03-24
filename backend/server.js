const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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
const materialRoutes = require('./routes/materialRoutes');
const sessionRoutes = require('./routes/sessionRoutes'); 
const feedbackRoutes = require('./routes/feedbackRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');


const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Allows us to send/receive JSON
app.use(express.urlencoded({ extended: true })); // <-- NEW: Crucial for parsing FormData and files!

// --- API Endpoints ---
app.use('/api/employees', employeeRoutes);
app.use('/api/students', studentRoutes); 
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/courses', courseRoutes); 
app.use('/api/events', eventRoutes); 
app.use('/api/materials', materialRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/', (req, res) => {
  res.send('TrioSLK API is running...');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});