const express = require('express');
const {getAdmins, createAdmin, updateAdminIsActive} = require('../controllers/adminController');
const {getUserLogs, getUserActivity, getEmailActivity} = require('../controllers/activityController');
const {updatePasswordAdmin} = require('../controllers/updatePasswordAdminController');
const { admin, superAdmin } = require('../middleware/isAllowed');
const router = express.Router();

router.use(admin);
router.get('/admins', getAdmins);
router.put('/reset-password', updatePasswordAdmin)
router.get('/user-logs', getUserLogs);
router.get('/user-activity', getUserActivity);
router.get('/user-email', getEmailActivity);
router.post('/create', superAdmin, createAdmin);
router.put('/update', superAdmin, updateAdminIsActive);

module.exports = router;