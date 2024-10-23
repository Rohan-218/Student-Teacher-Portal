const AttenMarksModel = require('../models/attenMarksModel');

const getAttendanceAndMarksBySubject = async (subjectId) => {
  try {
    // The model returns both result and examNames, so return the full object
    const data = await AttenMarksModel.fetchAttendanceAndMarksBySubject(subjectId);
    return data;
  } catch (error) {
    console.error('Error in fetching attendance and marks from model:', error);
    throw new Error('Service error while fetching attendance and marks');
  }
};

module.exports = { getAttendanceAndMarksBySubject };
