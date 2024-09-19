const teacherManagementModel = require('../models/teacherManagementModel');

exports.createTeacher = async (teacherData) => {
  const { name, email, password, designation, contactNo, subjects } = teacherData;

  // Create a new user with user_type 2 (for teacher)
  const userId = await teacherManagementModel.createUser({ email, password });

  // Create a new teacher in the teacher table
  const teacherId = await teacherManagementModel.createTeacher({
    teacher_name: name,
    designation,
    user_id: userId,
    contact_no: contactNo
  });

  // Insert teacher and subject mappings in subject_teacher table
  for (const subjectCode of subjects) {
    const subjectId = await teacherManagementModel.getSubjectIdByCode(subjectCode);
    if (subjectId) {
      await teacherManagementModel.assignSubjectToTeacher(teacherId, subjectId);
    } else {
      throw new Error(`Subject code ${subjectCode} not found`);
    }
  }

  return { message: 'Teacher created successfully', teacherId };
};
