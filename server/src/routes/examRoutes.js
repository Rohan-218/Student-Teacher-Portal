const express = require('express');
const router = express.Router();
const { getExam, createExam, updateExamIsActive } = require('../controllers/examController');
const { admin } = require('../middleware/isAllowed');

router.get('/', getExam);
router.use(admin);
router.post('/create', createExam);
router.put('/update', updateExamIsActive);

module.exports = router;