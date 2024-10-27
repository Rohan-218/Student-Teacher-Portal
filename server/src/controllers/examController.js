const { getExam, registerExam, changeExamStatus } = require('../services/examService');
const { insertActivity } = require('../utils/activityService');
const { getExamById } = require('../models/examModel');

exports.getExam = async (req, res) => {
  try {
    console.log('running');
      const exams = await getExam();
      res.status(200).json(exams);
    } catch (error) {
      console.error('Error fetching exam data:', error.message);
      res.status(500).json({ error: error.message });
    }
};

exports.createExam = async (req, res) => {

  const { examName, maximumMarks } = req.body;

  try {
      const  user_id = req.user.user_id;
      const result = await registerExam( examName, maximumMarks );

      insertActivity( user_id, 'New Exam-Type Added', `New Exam-Type -  ${examName}  have been added.`);
      return res.status(201).json({
          message: 'New exam type added successfully',
          data: result
      });
  } catch (error) {
      console.error('Error in controller:', error);
      return res.status(500).json({
          message: 'Failed to add new exam'
      });
  }
};

exports.updateExamIsActive = async (req, res) => {
  const { exam_id, is_active } = req.body;

  try {
    const user_id= req.user.user_id;
    const result = await changeExamStatus(exam_id, is_active);

    const status = is_active === 'true' ? 'active' : 'inactive';
    const name = await getExamById(exam_id);
    insertActivity( user_id, 'Exam status updated', `Status of exam-type - ${name} have been set to ${status}.`);
    return res.status(200).json({
      message: 'Exam status updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      message: 'Failed to update exam status'
    });
  }
};