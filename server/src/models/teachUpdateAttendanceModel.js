const sequelize = require('../config/dbConfig');

// Update attendance record for a specific student
const updateAttendance = async (subjectId, studentId, attendance, lecture, date) => {
    const query = `
      UPDATE attendance
      SET attendance = ?, updated_at = NOW()
      WHERE student_id = ? 
      AND attendance_record_id IN (
          SELECT attendance_record_id
          FROM attendance_record
          WHERE subject_id = ? AND date = ? AND lecture = ?
      );
    `;
  
    await sequelize.query(query, {
      replacements: [attendance, studentId, subjectId, date, lecture],
    });
  };
// Get student_id using enrollment_no
const getStudentIdByEnrollmentNo = async (enrollmentNo) => {
  const trimmedEnrollmentNo = enrollmentNo.trim();
  const query = `
    SELECT student_id FROM student WHERE enrollment_no = :enrollmentNo;
  `;

  const result = await sequelize.query(query, {
    replacements: { enrollmentNo: trimmedEnrollmentNo },
    type: sequelize.QueryTypes.SELECT,
  });

  return result.length ? result[0].student_id : null;
};

// Get subject_id using subject_code
const getSubjectIdByCode = async (subjectCode) => {
  const trimmedSubjectCode = subjectCode.trim();
  const query = `
    SELECT subject_id FROM subject WHERE LOWER(subject_code) = LOWER(:subjectCode);
  `;

  const result = await sequelize.query(query, {
    replacements: { subjectCode: trimmedSubjectCode },
    type: sequelize.QueryTypes.SELECT,
  });

  return result.length ? result[0].subject_id : null;
};

module.exports = {
  updateAttendance,
  getStudentIdByEnrollmentNo,
  getSubjectIdByCode,
};
