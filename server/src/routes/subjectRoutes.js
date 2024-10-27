const express = require('express');
const router = express.Router();
const { getSubjects, createSubject, getSubjectCount, updateSubjectIsActive } = require('../controllers/subjectController');
const { admin } = require('../middleware/isAllowed');

router.use(admin);
router.get('/', getSubjects);
router.get('/count', getSubjectCount);
router.post('/create', createSubject);
router.put('/update', updateSubjectIsActive);

module.exports = router;