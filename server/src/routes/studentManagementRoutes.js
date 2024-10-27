const express = require('express');
const { getStudentMarks, getStudentPerformance } = require('../controllers/adminStudentMarksController');
const { getStudentCount, getStudentProfile, updateStudentIsActive } = require('../controllers/studentManagementController')
const { getAllStudents, getStudentsByBranchAndSemester, searchStudentsByName } = require('../controllers/adminStudentListController');
const {createStudent} = require('../controllers/createStudentController');
const  {updateStudentDetails} = require('../controllers/updateStudentDetailsController');
const { getStudentAttendance, getStudentAttendanceTrend } = require('../controllers/adminStuAttenController');
const { admin } = require('../middleware/isAllowed');
const router = express.Router();

router.get('/count', admin, getStudentCount);
router.get('/', admin, getAllStudents);
router.get('/branch-semester', admin, getStudentsByBranchAndSemester);
router.get('/search', admin, searchStudentsByName);
router.put('/update', admin, updateStudentIsActive);
router.get('/profile/:userId', admin, getStudentProfile);
router.put('/edit', admin, updateStudentDetails);
router.get('/Marks/:userId/:examId', admin,  getStudentMarks);
router.get('/marksPerformance/:userId', admin, getStudentPerformance);
router.get('/attendance/:userId', admin, getStudentAttendance);
router.get('/attendance-trend', admin, getStudentAttendanceTrend);
router.post('/create', admin, createStudent);

module.exports = router;