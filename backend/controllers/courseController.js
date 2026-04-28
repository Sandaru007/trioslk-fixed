const Course = require('../models/Course');

// Get all live courses
const getCourses = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      return res.status(200).json([
        { _id: 'mock_c1', courseCode: 'CS101', title: 'Intro to Computer Science' },
        { _id: 'mock_c2', courseCode: 'SE202', title: 'Software Engineering' }
      ]);
    }
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Create a new course (Admin)
const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    // If the courseCode already exists, MongoDB throws a 11000 error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Course Code already exists!' });
    }
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Update a course (Admin)
const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete a course (Admin)
const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };