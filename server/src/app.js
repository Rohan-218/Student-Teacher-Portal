const express = require('express');
const app = express();
const cors = require('cors');

//login
const loginRoutes = require('./routes/loginRoutes');

//profile
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const teacherProfileRoutes = require('./routes/teacherProfileRoutes');

//student-attendance
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');

//count
const countRoutes = require('./routes/countRoutes');

//admin student-record/management
const studentRecordRoutes = require('./routes/studentRecordRoutes');
const studentManagementRoutes = require('./routes/studentManagementRoutes');

//admin teacher-record/management
const teacherRecordRoutes = require('./routes/teacherRecordRoutes');
const teacherManagementRoutes = require('./routes/teacherManagementRoutes');



// Middleware
app.use(cors());
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

//admin student-record/management
app.use('/api/admin', studentRecordRoutes);
app.use('/api/admin/student', studentManagementRoutes);

//admin teacher-record/management
app.use('/api/admin', teacherRecordRoutes);


// Debugging line to check if routes are loading
console.log("Teacher Routes Loaded:", teacherManagementRoutes);
app.use('/api/admin/teacher', teacherManagementRoutes);
// Debugging line to ensure app is listening
console.log("Server is running...");


//Error handling middleware (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

