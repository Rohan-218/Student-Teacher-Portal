const express = require('express');
const {getAdmins, createAdmin, updateAdminIsActive} = require('../controllers/adminController');
const {getUserLogs, getUserActivity, getEmailActivity} = require('../controllers/activityController');
const {updatePasswordAdmin} = require('../controllers/updatePasswordAdminController');
const { admin, superAdmin } = require('../middleware/isAllowed');
const router = express.Router();

// Define the route to get manage admins
router.get('/admins', admin, getAdmins);
router.post('/create', superAdmin, createAdmin);
router.put('/update', superAdmin, updateAdminIsActive);

// Define the route to reset user password
router.put('/reset-password', admin, updatePasswordAdmin)

// Define the route to get user activity
router.get('/user-logs', admin, getUserLogs);
router.get('/user-activity', admin, getUserActivity);
router.get('/user-email', admin, getEmailActivity);

module.exports = router;