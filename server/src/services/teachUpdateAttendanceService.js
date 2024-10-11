// attendanceService.js

const {
    getSubjectIdByCode,
    updateAttendance,
    getStudentIdByEnrollmentNo,
  } = require('../models/teachUpdateAttendanceModel');
  
  const updateMultipleAttendance = async (subjectCode, date, lecture, attendanceRecords) => {
    const subjectId = await getSubjectIdByCode(subjectCode);
  
    if (!subjectId) {
      throw new Error('Subject not found');
    }
  
    // Loop through each attendance record to update
    for (const record of attendanceRecords) {
      const { enrollmentNo, newAttendance } = record;
      const studentId = await getStudentIdByEnrollmentNo(enrollmentNo);
  
      if (!studentId) {
        throw new Error(`Student with enrollment number ${enrollmentNo} not found`);
      }
  
      // Assuming `newAttendance` can only be "Present" or "Absent"
      await updateAttendance(subjectId, studentId, newAttendance, lecture, date);
    }
  
    return { message: 'Attendance updated successfully' };
  };
  
  module.exports = {
    updateMultipleAttendance,
  };
  