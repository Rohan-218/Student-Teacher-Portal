const express = require('express');
const marksController = require('../controllers/marksBelowController');
const router = express.Router();
const { teacher } = require('../middleware/isAllowed');

router.get('/below-threshold', teacher, marksController.getStudentsBelowThreshold);

module.exports = router;