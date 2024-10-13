const { getSubjects, registerSubject, getSubjectCount, changeSubjectStatus } = require('../services/subjectService');

exports.getSubjects = async (req, res) => {
    try {
        // Extract filters from query parameters
        const { branchName, semester, subject_name } = req.query;

        // Call service to get subjects with filters
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
        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can see subject data.' });
    }
        const count = await getSubjectCount();
        res.status(200).json({ subjectCount: count });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching subject count' });
    }
};

exports.createSubject = async (req, res) => {
    const { subjectName, subjectCode, subjectInitials, branchName, semester} = req.body;

    try {
        // Check if the user is an admin (user_type 0 or 3)
        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can create subjects.' });
        }

        // Call the service to create the subject
        const result = await registerSubject( subjectName, subjectCode, subjectInitials, branchName, semester);

        // Return success response
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
      // Check if the user is a super admin (user_type 0)
      const userType = req.user.user_type;
      if (userType !== 0 && userType !== 3) {
        return res.status(403).json({ message: 'Access denied. Only admins can update subject status.' });
      }
  
      // Call the service to update the status
      const result = await changeSubjectStatus(subject_id, is_active);
  
      // Return success response
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