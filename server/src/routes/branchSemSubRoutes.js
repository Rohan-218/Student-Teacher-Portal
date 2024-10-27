const express = require('express');
const router = express.Router();
const branchSemSubController = require('../controllers/branchSemSubController');

router.get('/:subject_code', branchSemSubController.getBranchSemSubDetails);

module.exports = router;