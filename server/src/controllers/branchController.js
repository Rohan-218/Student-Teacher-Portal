const { getBranch, registerBranch, getBranchStudentCount, getBranchCount, changeBranchStatus } = require('../services/branchService');
const { insertActivity } = require('../utils/activityService');
const { getBranchById } = require('../models/branchModel');

exports.getBranch = async (req, res) => {
    try {
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
        const count = await getBranchCount();
        res.status(200).json({ branchCount: count });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching branch count' });
    }
};

exports.getBranchStudentCount= async (req, res) => {
    try {
        const data = await getBranchStudentCount();
        res.status(200).json({ branchStudentCount: data });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching branch-student count' });
    }
};

exports.createBranch = async (req, res) => {
    const { branchName } = req.body;

    try {
        const user_id = req.user.user_id;
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
      const user_id = req.user.user_id;
      const result = await changeBranchStatus(branch_id, is_active);
      
      const status = is_active ? 'active' : 'inactive';
      const name = await getBranchById(branch_id);
      insertActivity( user_id, 'Branch status updated', `Status of Branch - ${name} have been set to ${status}.`);

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