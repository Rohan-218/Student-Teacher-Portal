const express = require('express');
const router = express.Router();
const { getBranch, createBranch, getBranchCount, getBranchStudentCount, updateBranchIsActive } = require('../controllers/branchController');
const { admin } = require('../middleware/isAllowed');

router.get('/', admin, getBranch);
router.get('/count', admin, getBranchCount);
router.get('/student-count', admin, getBranchStudentCount);
router.post('/create', admin, createBranch);
router.put('/update', admin, updateBranchIsActive);

module.exports = router;