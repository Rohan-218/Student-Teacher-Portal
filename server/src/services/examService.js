const { getExam, createExam, updateExamStatus } = require('../models/examModel');

exports.getExam = async () => {
    try {
      const exam = await getExam();
        return exam;
    } catch (error) {
        console.error('Error in fetchExam service:', error);
        throw new Error('Unable to retrieve exam details from database');
    }
  };

  exports.registerExam = async ( examName, maximumMarks ) => {
    try {
        
        const result = await createExam( examName, maximumMarks );

        return result;
    } catch (error) {
        console.error('Service Error: Failed to add new exam', error);
        throw new Error('Service Error: Failed to register new exam-type');
    }
};

exports.changeExamStatus = async ( exam_id, is_active ) => {
    try {
  
        const result = await updateExamStatus(exam_id, is_active);
  
        return result;
    } catch (error) {
        console.error('Service Error: Failed to update exam status', error);
        throw new Error('Service Error: Failed to update exam status');
    }
  };