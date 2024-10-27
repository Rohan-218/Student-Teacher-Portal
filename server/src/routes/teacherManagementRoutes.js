const express = require('express');
const { getTeacherCount, getTeacherProfile, updateTeacherIsActive } = require('../controllers/teacherManagementController')
const { getAllTeachers, getTeachersByBranchAndSemester, searchTeachersByName } = require('../controllers/adminTeacherListController');
const createTeacherController = require('../controllers/createTeacherController');
const  {updateTeacherDetails} = require('../controllers/updateTeacherDetailsController');
const { admin } = require('../middleware/isAllowed');
const router = express.Router();

router.get('/count', admin, getTeacherCount);
router.put('/update', admin, updateTeacherIsActive);
router.get('/profile/:userId', admin, getTeacherProfile);
router.get('/', admin, getAllTeachers);
router.put('/edit', admin, updateTeacherDetails);
router.get('/branch-semester', admin, getTeachersByBranchAndSemester);
router.get('/search', admin, searchTeachersByName);
router.post('/create', admin, createTeacherController.createTeacher);

module.exports = router;