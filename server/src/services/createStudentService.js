const createStudentModel = require('../models/createStudentModel');

exports.createStudent = async (studentData) => {
  const { name, enrollmentNo, email, password, branch, semester, contactNo } = studentData;
  const branchId = await createStudentModel.getBranchIdByName(branch);
  if (!branchId) {
    throw new Error(`Branch ${branch} does not exist.`);
  }
  const userId = await createStudentModel.createUser({ email, password });
  const newStudent = {
    student_name: name,
    enrollment_no: enrollmentNo,
    user_id: userId,
    branch_id: branchId,
    semester,
    contact_no: contactNo
  };

  const student = await createStudentModel.createStudent(newStudent);
  return student;
};