const { getTeacherDetailsById } = require('../models/teacherModel.js');
const attendanceModel = require('../models/teacherPostAttendanceModel');

exports.getTeacherProfile = async (userId) => {
    try {
        const teacher = await getTeacherDetailsById(userId);
        return teacher;
    } catch (error) {
        throw new Error('Error fetching teacher profile: ' + error.message);
    }
};

exports.uploadAttendance = async (subjectCode, lecture, attendanceDate, attendanceList) => {
    try {
      const subjectId = await attendanceModel.getSubjectIdByCode(subjectCode);
  
      if (!subjectId) {
        return { success: false, error: 'Subject not found' };
      }
  
      // Create an attendance record
      const attendanceRecordId = await attendanceModel.createAttendanceRecord(subjectId, lecture, attendanceDate);
      console.log('Created Attendance Record ID:', attendanceRecordId); // Log the created ID
  
      // Loop through the attendance list and insert records
      for (const entry of attendanceList) {
        const { enrollment_no, status } = entry;
        const studentId = await attendanceModel.getStudentIdByEnrollmentNo(enrollment_no);
  
        if (!studentId) {
          return { success: false, error: `Student with enrollment number ${enrollment_no} not found` };
        }
  
        await attendanceModel.insertAttendanceRecord(studentId, attendanceRecordId, status, subjectId);
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error in uploadAttendance service:', error);
      return { success: false, error: 'Error uploading attendance' };
    }
  };
  
  // Retrieve uploaded attendance based on subjectCode, date, and lecture
exports.getUploadedAttendance = async (subjectCode, date, lecture) => {
  const subjectId = await attendanceModel.getSubjectIdByCode(subjectCode);
  if (!subjectId) throw new Error('Subject not found');
  
  const attendanceData = await attendanceModel.getAttendanceDataBySubjectId(subjectId, date, lecture);
  return attendanceData;
};