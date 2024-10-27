const express = require('express');
const router = express.Router();
const { getExam, createExam, updateExamIsActive } = require('../controllers/examController');
const { admin } = require('../middleware/isAllowed');

router.get('/', admin, getExam);
router.post('/create', admin, createExam);
router.put('/update', admin, updateExamIsActive);

module.exports = router;