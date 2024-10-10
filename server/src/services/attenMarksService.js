// services/attenMarksService.js
const AttenMarksModel = require('../models/attenMarksModel');

const getAttendanceAndMarksBySubject = async (subjectId) => {
  return await AttenMarksModel.fetchAttendanceAndMarksBySubject(subjectId);
};

module.exports = { getAttendanceAndMarksBySubject };
