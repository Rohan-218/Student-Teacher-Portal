// attendanceService.js
const userModel  = require('../models/userModel');
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
  
  const getUserId = async (attendanceRecords) => {
    try {
      // Check if attendance records are provided
      if (!attendanceRecords || attendanceRecords.length === 0) {
        throw new Error('No attendance records provided');
      }
  
      const Ids = []; // Array to hold results for all enrollment numbers
  
      for (const record of attendanceRecords) {
        const { enrollmentNo, newAttendance } = record; // Extract enrollmentNo from attendance record
  
        const query = `
          SELECT user_id
          FROM student 
          WHERE enrollment_no = :enrollmentNo;
        `;
  
        // Execute the query
        const results = await sequelize.query(query, {
          replacements: { enrollmentNo }, // This will replace :enrollmentNo with the current enrollment number
          type: sequelize.QueryTypes.SELECT,
        });
  
        if (results.length === 0) {
          throw new Error(`No user IDs found for enrollment number: ${enrollmentNo}`);
        }
  
        // Accumulate results in the array, pushing user_id from the query results
        Ids.push(...results.map(result => result.user_id));
      }
      console.log(Ids);
      // Fetch emails based on the accumulated user IDs
      const allResults = await userModel.getUserEmails(Ids);
      
      return allResults; // Return all results after the loop
    } catch (error) {
      console.error('Error fetching student emails:', error);
      throw error; // Re-throw the error after logging it
    }
  };
  
  
  module.exports = {
    updateMultipleAttendance,
    getUserId
  };
  