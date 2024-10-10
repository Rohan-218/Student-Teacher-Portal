const express = require('express');
const { getTeacherCount, getTeacherProfile, updateTeacherIsActive } = require('../controllers/teacherManagementController')
const { getAllTeachers, getTeachersByBranchAndSemester, searchTeachersByName } = require('../controllers/adminTeacherListController');
const createTeacherController = require('../controllers/createTeacherController');
const  {updateTeacherDetails} = require('../controllers/updateTeacherDetailsController');

const router = express.Router();

router.get('/count', getTeacherCount);

router.put('/update', updateTeacherIsActive);
router.get('/profile/:userId', getTeacherProfile);

router.get('/', getAllTeachers);
router.put('/edit', updateTeacherDetails);

// API to get teachers by branch and semester
router.get('/branch-semester', getTeachersByBranchAndSemester);

// API to search teachers by name
router.get('/search', searchTeachersByName);

router.post('/create', createTeacherController.createTeacher);

module.exports = router;