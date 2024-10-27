const { getSubjects, registerSubject, getSubjectCount, changeSubjectStatus } = require('../services/subjectService');
const { getSubjectById } = require('../models/subjectModel');
const { insertActivity } = require('../utils/activityService');

exports.getSubjects = async (req, res) => {
    try {
        const { branchName, semester, subject_name } = req.query;
        const subjects = await getSubjects({
            branch_name: branchName || null,
            semester: semester ? parseInt(semester, 10) : null,
            subject_name: subject_name || null
        });

        if (subjects.length > 0) {
            return res.status(200).json(subjects);
        } else {
            return res.status(404).json({ message: 'No Subject Found' });
        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return res.status(500).json({ message: 'Failed to retrieve subjects due to server error' });
    }
};

exports.getSubjectCount= async (req, res) => {
    try {
        const count = await getSubjectCount();
        res.status(200).json({ subjectCount: count });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching subject count' });
    }
};

exports.createSubject = async (req, res) => {
    const { subjectName, subjectCode, subjectInitials, branchName, semester} = req.body;

    try {
        const  user_id = req.user.user_id;
        const result = await registerSubject( subjectName, subjectCode, subjectInitials, branchName, semester);

        insertActivity( user_id, 'New Subject Added', `New Subject - ( ${subjectName} ) have been added.`);
        return res.status(201).json({
            message: 'Subject created successfully',
            data: result
        });
    } catch (error) {
        console.error('Error in controller:', error);
        return res.status(500).json({
            message: 'Failed to add Subject'
        });
    }
};

exports.updateSubjectIsActive = async (req, res) => {
    const { subject_id, is_active } = req.body;
  
    try {
      const user_id= req.user.user_id;
      const result = await changeSubjectStatus(subject_id, is_active);
  
      const status = is_active ? 'active' : 'inactive';
      const name = await getSubjectById(subject_id);
      insertActivity( user_id, 'Subject status updated', `Status of Subject - ${name} have been set to ${status}.`);
      
      return res.status(200).json({
        message: 'Subject status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in controller:', error);
      return res.status(500).json({
        message: 'Failed to update subject status'
      });
    }
};