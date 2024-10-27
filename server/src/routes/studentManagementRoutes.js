const express = require('express');
const { getStudentMarks, getStudentPerformance } = require('../controllers/adminStudentMarksController');
const { getStudentCount, getStudentProfile, updateStudentIsActive } = require('../controllers/studentManagementController')
const { getAllStudents, getStudentsByBranchAndSemester, searchStudentsByName } = require('../controllers/adminStudentListController');
const {createStudent} = require('../controllers/createStudentController');
const  {updateStudentDetails} = require('../controllers/updateStudentDetailsController');
const { getStudentAttendance, getStudentAttendanceTrend } = require('../controllers/adminStuAttenController');
const { admin } = require('../middleware/isAllowed');
const router = express.Router();

router.use(admin);
router.get('/count',  getStudentCount);
router.get('/',  getAllStudents);
router.get('/branch-semester',  getStudentsByBranchAndSemester);
router.get('/search',  searchStudentsByName);
router.put('/update',  updateStudentIsActive);
router.get('/profile/:userId',  getStudentProfile);
router.put('/edit',  updateStudentDetails);
router.get('/Marks/:userId/:examId',   getStudentMarks);
router.get('/marksPerformance/:userId',  getStudentPerformance);
router.get('/attendance/:userId',  getStudentAttendance);
router.get('/attendance-trend',  getStudentAttendanceTrend);
router.post('/create',  createStudent);

module.exports = router;