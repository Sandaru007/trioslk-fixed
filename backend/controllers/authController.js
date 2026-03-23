const loginUser = async (req, res) => {
  const { username, password } = req.body; // username will be Admin Email OR Student ID

  try {
    // 1. Check Admin (Using the .env variables we just fixed)
    if (username === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      return res.json({
        _id: 'admin',
        name: 'Super Admin',
        role: 'admin',
        token: generateToken('admin', 'admin')
      });
    }

    // 2. Check Student (Using studentId)
    const student = await Student.findOne({ studentId: username });
    if (student && (await student.matchPassword(password))) {
      return res.json({
        _id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        role: 'student',
        token: generateToken(student._id, 'student')
      });
    }

    res.status(401).json({ message: 'Invalid ID or Password' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};