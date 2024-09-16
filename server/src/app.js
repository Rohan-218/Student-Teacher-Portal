
const express = require('express');
//const bodyParser = require('body-parser');
const loginRoutes = require('./routes/loginRoutes');
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const teacherProfileRoutes = require('./routes/teacherProfileRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/login', loginRoutes);
app.use('/api/student', studentProfileRoutes);
app.use('/api/teacher', teacherProfileRoutes);

//Error handling middleware (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

