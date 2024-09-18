const express = require('express');
const countController = require('../controllers/countController');
const router = express.Router();

// API routes for counts
router.get('/student-count', countController.getStudentCount);
router.get('/teacher-count', countController.getTeacherCount);
router.get('/subject-count', countController.getSubjectCount);
router.get('/branch-count', countController.getBranchCount);
router.get('/student-branch-count', countController.getStudentBranchCount);

module.exports = router;
