const { getBranch, registerBranch, getBranchStudentCount, getBranchCount, changeBranchStatus } = require('../services/branchService');
const { insertActivity } = require('../utils/activityService');
const { getBranchById } = require('../models/branchModel');

exports.getBranch = async (req, res) => {
    try {
        // Extract filters from query parameters
        const { branchName, semester} = req.query;

        const branch = await getBranch({
            branch_name: branchName || null,
            semester: semester ? parseInt(semester, 10) : null
        });

        if (branch.length > 0) {
            return res.status(200).json(branch);
        } else {
            return res.status(404).json({ message: 'No Branch Found' });
        }
    } catch (error) {
        console.error('Error fetching branch:', error);
        return res.status(500).json({ message: 'Failed to retrieve branch due to server error' });
    }
};

exports.getBranchCount= async (req, res) => {
    try {
        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can see branch data.' });
        }
        const count = await getBranchCount();
        res.status(200).json({ branchCount: count });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching branch count' });
    }
};

exports.getBranchStudentCount= async (req, res) => {
    try {
        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can see branch data.' });
    }
        const data = await getBranchStudentCount();
        res.status(200).json({ branchStudentCount: data });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching branch-student count' });
    }
};

exports.createBranch = async (req, res) => {
    const { branchName } = req.body;

    try {
        // Check if the user is an admin (user_type 0 or 3)
        const { user_type, user_id } = req.user.user_type;
        if (user_type !== 0 && user_type !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can add branch.' });
        }

        // Call the service to create the subject
        const result = await registerBranch( branchName );

        insertActivity( user_id, 'New Branch Added', `New Branch - ( ${branchName} ) have been added.`);
        // Return success response
        return res.status(201).json({
            message: 'Branch added successfully',
            data: result
        });
    } catch (error) {
        console.error('Error in controller:', error);
        return res.status(500).json({
            message: 'Failed to add branch'
        });
    }
};

exports.updateBranchIsActive = async (req, res) => {
    const { branch_id, is_active } = req.body;
  
    try {
      // Check if the user is a super admin (user_type 0)
      const {user_id, user_type} = req.user;
      if (user_type !== 0 && user_type !== 3) {
        return res.status(403).json({ message: 'Access denied. Only admins can update branch status.' });
      }
  
      const result = await changeBranchStatus(branch_id, is_active);
      
      const status = is_active ? 'active' : 'inactive';
      const name = await getBranchById(branch_id);
      insertActivity( user_id, 'Branch status updated', `Status of Branch - ${name} have been set to ${status}.`);

      // Return success response
      return res.status(200).json({
        message: 'Branch status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in controller:', error);
      return res.status(500).json({
        message: 'Failed to update branch status'
      });
    }
  };