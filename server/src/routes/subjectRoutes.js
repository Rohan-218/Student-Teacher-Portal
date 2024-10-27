const express = require('express');
const router = express.Router();
const { getSubjects, createSubject, getSubjectCount, updateSubjectIsActive } = require('../controllers/subjectController');
const { admin } = require('../middleware/isAllowed');

router.get('/', admin, getSubjects);
router.get('/count', admin, getSubjectCount);
router.post('/create', admin, createSubject);
router.put('/update', admin, updateSubjectIsActive);

module.exports = router;
