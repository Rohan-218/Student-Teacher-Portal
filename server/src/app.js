const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {authenticate, isTokenBlacklisted} = require('./middleware/authMiddleware.js');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging middleware for dev environment
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Import routes
const authRoutes = require('./routes/authRoutes.js');
// const profileRoutes = require('./routes/profileRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
// const teacherRoutes = require('./routes/teacherRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
// const studentManagementRoutes = require('./routes/studentManagementRoutes.js');
// const teacherManagementRoutes = require('./routes/teacherManagementRoutes.js');
// const subjectRoutes = require('./routes/subjectRoutes.js');
// const branchRoutes = require('./routes/branchRoutes.js');
// const examRoutes = require('./routes/examRoutes.js');

// // Use routes
app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);
app.use(authenticate); 
// Authenticate middleware;
app.use('/api/students', studentRoutes);
// app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/admin/students', studentManagementRoutes);
// app.use('/api/admin/teacher', teacherManagementRoutes);
// app.use('/api/admin/subjects', subjectRoutes);
// app.use('/api/admin/branches', branchRoutes);
// app.use('/api/admin/exams', examRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// Handle 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;