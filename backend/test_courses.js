const mongoose = require('mongoose');
const Course = require('./models/Course');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const courses = await Course.find();
  let out = "Found " + courses.length + " courses:\n";
  courses.forEach(c => {
    out += `- ${c.title}: ${c.imageUrl}\n`;
  });
  fs.writeFileSync('test_out.txt', out);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
