// const sequelize = require('../config/dbConfig');

// // Get subject_id using subject_code
// const getSubjectIdByCode = async (subjectCode) => {
//   const trimmedSubjectCode = subjectCode.trim();
//   console.log('Received subjectCode:', trimmedSubjectCode);

//   const query = `
//     SELECT subject_id FROM subject WHERE LOWER(subject_code) = LOWER(:subjectCode);
//   `;

//   const result = await sequelize.query(query, {
//     replacements: { subjectCode: trimmedSubjectCode },
//     type: sequelize.QueryTypes.SELECT,
//   });

//   console.log('Query result:', result);

//   return result.length ? result[0].subject_id : null;
// };

// // Insert into attendance_record table with date selected by teacher
// const createAttendanceRecord = async (subjectId, lecture, attendanceDate) => {
//   console.log('Subject ID:', subjectId);

//   const query = `
//     INSERT INTO attendance_record (subject_id, lecture, date, updated_last)
//     VALUES (:subjectId, :lecture, :attendanceDate::date, NOW())
//     RETURNING attendance_record_id;
//   `;

//   const result = await sequelize.query(query, {
//     replacements: { subjectId, lecture, attendanceDate },
//     type: sequelize.QueryTypes.INSERT,
//   });

//   console.log('Attendance Record Created:', result);

//   // Correctly extract the attendance_record_id
//   return result[0][0].attendance_record_id;
// };

// // Get student_id using enrollment_no
// const getStudentIdByEnrollmentNo = async (enrollmentNo) => {
//   console.log('Querying for student with enrollment number:', enrollmentNo); // Log the enrollment number received

//   const query = `
//     SELECT student_id FROM student WHERE enrollment_no = :enrollmentNo;
//   `;

//   const result = await sequelize.query(query, {
//     replacements: { enrollmentNo }, // Corrected: make sure this object has the exact key `enrollmentNo`
//     type: sequelize.QueryTypes.SELECT,
//   });

//   console.log('Query result for student_id:', result); // Log the query result

//   return result.length ? result[0].student_id : null;
// };


// // Insert attendance record for a student
// const insertAttendanceRecord = async (studentId, attendanceRecordId, attendance, subjectId) => {
//   console.log('Inserting attendance for student:', studentId, 'with record ID:', attendanceRecordId);

//   const query = `
//     INSERT INTO attendance (student_id, attendance, attendance_record_id, subject_id)
//     VALUES (:studentId, :attendance, :attendanceRecordId, :subjectId);
//   `;

//   await sequelize.query(query, {
//     replacements: {
//       studentId,
//       attendance,
//       attendanceRecordId,
//       subjectId
//     },
//     type: sequelize.QueryTypes.INSERT,
//   });

//   console.log('Attendance record inserted successfully');
// };

// // Get attendance data by subject_id, date, and lecture
// const getAttendanceDataBySubjectId = async (subjectId, date, lecture) => {
//   const query = `
//     SELECT a.attendance_id, s.student_id, s.enrollment_no, a.attendance, a.percentage, ar.date
//     FROM attendance a
//     INNER JOIN student s ON a.student_id = s.student_id
//     INNER JOIN attendance_record ar ON a.attendance_record_id = ar.attendance_record_id
//     WHERE ar.subject_id = :subjectId
//       AND ar.date = :date
//       AND ar.lecture = :lecture;
//   `;

//   const result = await sequelize.query(query, {
//     replacements: { subjectId, date, lecture },
//     type: sequelize.QueryTypes.SELECT,
//   });

//   return result;
// };
// module.exports = {
//   getSubjectIdByCode,
//   createAttendanceRecord,
//   getStudentIdByEnrollmentNo,
//   insertAttendanceRecord,
//   getAttendanceDataBySubjectId,
// };


const sequelize = require('../config/dbConfig');

// Get subject_id using subject_code
const getSubjectIdByCode = async (subjectCode) => {
  const trimmedSubjectCode = subjectCode.trim();
  console.log('Received subjectCode:', trimmedSubjectCode);

  const query = `
    SELECT subject_id FROM subject WHERE LOWER(subject_code) = LOWER(:subjectCode);
  `;

  const result = await sequelize.query(query, {
    replacements: { subjectCode: trimmedSubjectCode },
    type: sequelize.QueryTypes.SELECT,
  });

  console.log('Query result:', result);

  return result.length ? result[0].subject_id : null;
};

// Insert into attendance_record table with date selected by teacher
const createAttendanceRecord = async (subjectId, lecture, attendanceDate) => {
  console.log('Subject ID:', subjectId);

  const query = `
    INSERT INTO attendance_record (subject_id, lecture, date, updated_last)
    VALUES (:subjectId, :lecture, :attendanceDate::date, NOW())
    RETURNING attendance_record_id;
  `;

  const result = await sequelize.query(query, {
    replacements: { subjectId, lecture, attendanceDate },
    type: sequelize.QueryTypes.INSERT,
  });

  console.log('Attendance Record Created:', result);

  // Correctly extract the attendance_record_id
  return result[0][0].attendance_record_id;
};

// Get student_id using enrollment_no
const getStudentIdByEnrollmentNo = async (enrollmentNo) => {
  console.log('Querying for student with enrollment number:', enrollmentNo); // Log the enrollment number received

  const query = `
    SELECT student_id FROM student WHERE enrollment_no = :enrollmentNo;
  `;

  const result = await sequelize.query(query, {
    replacements: { enrollmentNo }, // Corrected: make sure this object has the exact key `enrollmentNo`
    type: sequelize.QueryTypes.SELECT,
  });

  console.log('Query result for student_id:', result); // Log the query result

  return result.length ? result[0].student_id : null;
};

// Insert attendance record for a student
const insertAttendanceRecord = async (studentId, attendanceRecordId, attendance, subjectId) => {
  console.log('Inserting attendance for student:', studentId, 'with record ID:', attendanceRecordId);

  const query = `
    INSERT INTO attendance (student_id, attendance, attendance_record_id, subject_id)
    VALUES (:studentId, :attendance, :attendanceRecordId, :subjectId);
  `;

  await sequelize.query(query, {
    replacements: {
      studentId,
      attendance,
      attendanceRecordId,
      subjectId
    },
    type: sequelize.QueryTypes.INSERT,
  });

  console.log('Attendance record inserted successfully');
};

// Get attendance data by subject_id, date, and lecture
const getAttendanceDataBySubjectId = async (subjectId, date, lecture) => {
  const query = `
    SELECT a.attendance_id, s.student_id, s.enrollment_no, a.attendance, a.percentage, ar.date
    FROM attendance a
    INNER JOIN student s ON a.student_id = s.student_id
    INNER JOIN attendance_record ar ON a.attendance_record_id = ar.attendance_record_id
    WHERE ar.subject_id = :subjectId
      AND ar.date = :date
      AND ar.lecture = :lecture;
  `;

  const result = await sequelize.query(query, {
    replacements: { subjectId, date, lecture },
    type: sequelize.QueryTypes.SELECT,
  });

  return result;
};

// Get total lectures for a subject
const getTotalLectures = async (subjectCode) => {
  const query = `
    SELECT COUNT(ar.*) AS total 
    FROM attendance_record ar
    JOIN subject s ON ar.subject_id = s.subject_id
    WHERE s.subject_code = :subjectCode;
  `;

  const result = await sequelize.query(query, {
    replacements: { subjectCode },
    type: sequelize.QueryTypes.SELECT,
  });

  return result.length ? result[0].total : 0;
};

const getAttendedLectures = async (studentIds, subjectCode) => {
  try {
    console.log('Input:', studentIds, subjectCode);

    // Query to fetch subject_id from subject table
    const subjectQuery = `
      SELECT subject_id FROM subject
      WHERE subject_code = :subjectCode
      LIMIT 1;
    `;

    const subjectResult = await sequelize.query(subjectQuery, {
      replacements: { subjectCode },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!subjectResult.length) {
      throw new Error(`Subject with code ${subjectCode} not found`);
    }

    const subjectId = subjectResult[0].subject_id;
    console.log('Subject ID:', subjectId);

    // Query to get attended lectures count for each student
    const attendanceQuery = `
      SELECT student_id, COUNT(*) AS attended FROM attendance
      WHERE student_id IN (:studentIds)
        AND subject_id = :subjectId
        AND attendance = TRUE
      GROUP BY student_id;
    `;

    const attendanceResult = await sequelize.query(attendanceQuery, {
      replacements: { studentIds: studentIds, subjectId },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log('Attendance Query Result:', attendanceResult);

    // Convert the result to an array with student IDs and their attended counts
    const attendedLectures = studentIds.map(id => {
      const studentAttendance = attendanceResult.find(result => result.student_id === id);
      return {
        studentId: id,
        attended: studentAttendance ? studentAttendance.attended : 0,
      };
    });

    return attendedLectures;
  } catch (error) {
    console.error('Error fetching attended lectures:', error);
    throw error;
  }
};


module.exports = {
  getSubjectIdByCode,
  createAttendanceRecord,
  getStudentIdByEnrollmentNo,
  insertAttendanceRecord,
  getAttendanceDataBySubjectId,
  getTotalLectures, // New function
  getAttendedLectures // New function
};
