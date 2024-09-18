const express = require('express');
const app = express();
//login
const loginRoutes = require('./routes/loginRoutes');
//profile
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const teacherProfileRoutes = require('./routes/teacherProfileRoutes');
//student-attendance
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
//count
const countRoutes = require('./routes/countRoutes');
//admin student-record
const studentRecordRoutes = require('./routes/studentRecordRoutes');



// Middleware
app.use(express.json());


//login
app.use('/api/login', loginRoutes);

//Routes for Student-Teacher portal
//profile
app.use('/api/student', studentProfileRoutes);
app.use('/api/teacher', teacherProfileRoutes);
//student-attendance
app.use('/api/student', studentAttendanceRoutes);

//Routes for admin panel
//count
app.use('/api/admin', countRoutes);
//studentrecord
app.use('/api/admin', studentRecordRoutes);


//Error handling middleware (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

