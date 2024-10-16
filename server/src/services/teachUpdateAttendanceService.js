const sequelize = require('../config/dbConfig');
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
  
    for (const record of attendanceRecords) {
      const { enrollmentNo, newAttendance } = record;
      const studentId = await getStudentIdByEnrollmentNo(enrollmentNo);
  
      if (!studentId) {
        throw new Error(`Student with enrollment number ${enrollmentNo} not found`);
      }
  
      await updateAttendance(subjectId, studentId, newAttendance, lecture, date);
    }
  
    return { message: 'Attendance updated successfully' };
  };


  const getStudentId = async (attendanceList) => {
    try {
      const studentdata = [];
  
      for (const attendance of attendanceList) {
        console.log(attendance);
        const { enrollmentNo } = attendance;
        console.log('thatttt',enrollmentNo);
  
        // Fetch student ID based on enrollment number
        const studentID = await sequelize.query(
          `SELECT student_id FROM student WHERE enrollment_no = :enrollmentNo`, 
          {
            replacements: { enrollmentNo },
            type: sequelize.QueryTypes.SELECT
          }
        );
  
        // Check if no student found
        if (studentID.length === 0) {
          throw new Error(`No student found with enrollment number ${enrollment_no}`);
        }
  
        // Push the student ID into the studentdata array
        studentdata.push(...studentID);
      }
  
      return studentdata;
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw error;
    }
  };
  
  
  
  
  module.exports = {
    updateMultipleAttendance,
    getStudentId
  };
  