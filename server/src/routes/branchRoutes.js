const express = require('express');
const router = express.Router();
const { getBranch, createBranch, getBranchCount, getBranchStudentCount, updateBranchIsActive } = require('../controllers/branchController');
const { admin } = require('../middleware/isAllowed');

router.use(admin);
router.get('/', getBranch);
router.get('/count', getBranchCount);
router.get('/student-count', getBranchStudentCount);
router.post('/create', createBranch);
router.put('/update', updateBranchIsActive);

module.exports = router;