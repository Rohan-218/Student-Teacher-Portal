const { getSubjects, getSubjectCount} = require('../models/subjectModel'); // Import the Subject model directly
const { createSubject } = require('../models/createSubjectModel');
const { updateSubjectStatus } = require('../models/changeSubjectIsActiveModel');

exports.getSubjects = async (filters) => {
    try {
      // Fetch subjects from the database
      const subjects = await getSubjects(filters);
        return subjects;
    } catch (error) {
        console.error('Error in fetchSubjects service:', error);
        throw new Error('Unable to retrieve subject details from database');
    }
  };

exports.getSubjectCount = async () => {
    try {
      const subjectCount = await getSubjectCount();
      return subjectCount;
    } catch (error) {
      console.error("Error fetching subject count:", error);
      throw new Error("Failed to fetch subject count.");
    }
};

  exports.registerSubject = async ( subjectName, subjectCode, subjectInitials, branchName, semester) => {
    try {
        // Call the model function to create a user and admin
        const result = await createSubject( subjectName, subjectCode, subjectInitials, branchName, semester);

        return result;
    } catch (error) {
        console.error('Service Error: Failed to add subject', error);
        throw new Error('Service Error: Failed to register subject');
    }
};

exports.changeSubjectStatus = async (subject_id, is_active) => {
    try {
  
        const result = await updateSubjectStatus(subject_id, is_active);
  
        return result;
    } catch (error) {
        console.error('Service Error: Failed to update subject status', error);
        throw new Error('Service Error: Failed to update subject status');
    }
  };