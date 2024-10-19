const { getTeacherDetailsById } = require('../models/teacherModel.js');
const attendanceModel = require('../models/teacherPostAttendanceModel');
const sequelize = require('../config/dbConfig');

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

        const attendanceRecordId = await attendanceModel.createAttendanceRecord(subjectId, lecture, attendanceDate);
        console.log('Created Attendance Record ID:', attendanceRecordId);

        for (const entry of attendanceList) {
            const { enrollmentNo, newAttendance } = entry;
            const studentId = await attendanceModel.getStudentIdByEnrollmentNo(enrollmentNo);

            if (!studentId) {
                return { success: false, error: `Student with enrollment number ${enrollmentNo} not found` };
            }

            await attendanceModel.insertAttendanceRecord(studentId, attendanceRecordId, newAttendance, subjectId);
        }

        return { success: true };
    } catch (error) {
        console.error('Error in uploadAttendance service:', error);
        return { success: false, error: 'Error uploading attendance' };
    }
};

exports.getUploadedAttendance = async (subjectCode, date, lecture) => {
    const subjectId = await attendanceModel.getSubjectIdByCode(subjectCode);
    if (!subjectId) throw new Error('Subject not found');

    const attendanceData = await attendanceModel.getAttendanceDataBySubjectId(subjectId, date, lecture);
    return attendanceData;
};

exports.getStudentId = async (attendanceList) => {
    try {
        const studentData = [];
        for (const attendance of attendanceList) {
            const { enrollmentNo } = attendance;

            const studentID = await sequelize.query(
                `SELECT student_id FROM student WHERE enrollment_no = :enrollmentNo`,
                {
                    replacements: { enrollmentNo },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (studentID.length === 0) {
                throw new Error(`No student found with enrollment number ${enrollmentNo}`);
            }

            studentData.push(...studentID);
        }

        return studentData;
    } catch (error) {
        console.error('Error fetching student data:', error);
        throw error;
    }
};

exports.getSubjectNameByCode = async (subjectCode) => {
    try {
        const subjectName = await sequelize.query(
            `SELECT subject_name FROM subject WHERE subject_code = :subjectCode`,
            {
                replacements: { subjectCode },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (subjectName.length === 0) {
            throw new Error(`No subject found with code ${subjectCode}`);
        }

        return subjectName[0].subject_name;
    } catch (error) {
        console.error('Error fetching subject name:', error);
        throw error;
    }
};

exports.getTotalLecturesForSubject = async (subjectCode) => {
    try {
        const totalLectures = await attendanceModel.getTotalLectures(subjectCode);
        return totalLectures;
    } catch (error) {
        console.error('Error fetching total lectures:', error);
        throw error;
    }
};

exports.getAttendedLecturesForStudent = async (studentId, subjectCode) => {
    try {
        const attendedLectures = await attendanceModel.getAttendedLectures(studentId, subjectCode);
        return attendedLectures;
    } catch (error) {
        console.error('Error fetching attended lectures:', error);
        throw error;
    }
};
