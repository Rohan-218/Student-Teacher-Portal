const {
  getTeacherProfile, 
  uploadAttendance, 
  getUploadedAttendance,
  getStudentId,
  getSubjectNameByCode,
  getTotalLecturesForSubject,
  getAttendedLecturesForStudent
} = require('../services/teacherService');
const sendEmailNotification = require('../utils/emailservice');
const userService = require('../services/userService');

exports.getTeacherProfile = async (req, res) => {
  try {
      const usertype = req.user.user_type;

      if (usertype !== 2) { // Assuming user_type 2 is for teachers
          return res.status(403).json({ message: 'Unauthorized: Not a teacher' });
      }

      const teacher = await getTeacherProfile(req.user.user_id);

      if (!teacher) {
          return res.status(404).json({ message: 'Teacher not found' });
      }

      res.json(teacher);
  } catch (err) {
      res.status(500).json({ message: 'Error in teacher controller: ' + err.message });
  }
};

exports.uploadAttendance = async (req, res) => {
  try {
      const { subjectCode, lecture, attendanceDate, attendanceList } = req.body;

      // Validate attendance list
      if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
          return res.status(400).json({ message: 'Attendance list is required and must be an array.' });
      }

      // Validate other parameters
      if (!subjectCode || !lecture || !attendanceDate) {
          return res.status(400).json({ message: 'Subject code, lecture, and attendance date are required.' });
      }

      // Call service to upload attendance
      const uploadResult = await uploadAttendance(subjectCode, lecture, attendanceDate, attendanceList);

      if (uploadResult.success) {
          const studentIds = await getStudentId(attendanceList);
          const extractedStudentIds = studentIds.map(student => student.student_id);

          const subjectName = await getSubjectNameByCode(subjectCode);
          const studentData = await userService.getUserId(extractedStudentIds);
          const emailList = studentData.map(student => student.email);
          const studentNames = studentData.map(student => student.student_name);

          const totalLectures = await getTotalLecturesForSubject(subjectCode);

          if (totalLectures % 10 === 0) { // Check if total lectures is a multiple of 10
              const attendedLecturesResult = await getAttendedLecturesForStudent(extractedStudentIds, subjectCode);
              const studentsWithLowAttendance = attendedLecturesResult
                  .filter(({ attended }) => (attended / totalLectures) * 100 < 75)
                  .map(({ studentId }) => studentId);

              if (studentsWithLowAttendance.length > 0) {
                  // Send email notifications to students with low attendance
                  await Promise.all(studentsWithLowAttendance.map(async (studentId, idx) => {
                      const email = emailList[idx];
                      const text = `Dear student, your attendance for ${subjectName} has fallen below 75%.`;
                      const subject = 'Low Attendance Warning';

                      try {
                          const emailResponse = await sendEmailNotification([email], text, subject);
                          if (emailResponse) {
                              console.log('Email sent successfully to:', studentId);
                          }
                      } catch (error) {
                          console.log(`Error sending email to: ${studentId}`, error);
                      }
                  }));
              }
          }

          return res.status(200).json({ message: 'Attendance uploaded successfully and emails sent if necessary.' });
      } else {
          return res.status(500).json({ message: uploadResult.error || 'Failed to upload attendance' });
      }
  } catch (error) {
      console.error('Error uploading attendance:', error);
      res.status(500).json({ message: 'Error uploading attendance' });
  }
};

// GET to retrieve uploaded attendance by subjectCode, date, and lecture
exports.getUploadedAttendance = async (req, res) => {
  try {
      const { subjectCode, date, lecture } = req.query;
      const attendanceData = await getUploadedAttendance(subjectCode, date, lecture);
      res.status(200).json(attendanceData);
  } catch (error) {
      console.error('Error fetching uploaded attendance:', error);
      res.status(500).json({ message: 'Error fetching uploaded attendance' });
  }
};
