const mongoose = require('mongoose');
const Course = require('../backend/models/Course');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function checkCourse() {
  await mongoose.connect(process.env.MONGO_URI);
  const courses = await Course.find();
  courses.forEach(c => {
    console.log(`Title: ${c.title}, ImageUrl: ${c.imageUrl}`);
  });
  process.exit(0);
}

checkCourse();
