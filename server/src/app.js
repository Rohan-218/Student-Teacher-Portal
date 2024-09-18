const express = require('express');
//login
const loginRoutes = require('./routes/loginRoutes');
//profile
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const teacherProfileRoutes = require('./routes/teacherProfileRoutes');
//student-attendance
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
const countRoutes = require('./routes/countRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
//login
app.use('/api/login', loginRoutes);
//profile
app.use('/api/student', studentProfileRoutes);
app.use('/api/teacher', teacherProfileRoutes);
//student-attendance
app.use('/api/student', studentAttendanceRoutes);
//count
app.use('/api/admin', countRoutes);

//Error handling middleware (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

