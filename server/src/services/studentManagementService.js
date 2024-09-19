const studentManagementModel = require('../models/studentManagementModel');

exports.createStudent = async (studentData) => {
  // Destructure the input data
  const { name, enrollmentNo, email, password, branch, semester, contactNo } = studentData;
  
  // Check if branch exists and get branch_id
  const branchId = await studentManagementModel.getBranchIdByName(branch);
  if (!branchId) {
    throw new Error(`Branch ${branch} does not exist.`);
  }

  // Create a new user and get user_id
  const userId = await studentManagementModel.createUser({ email, password });
  
  // Create a new student with the obtained user_id and branch_id
  const newStudent = {
    student_name: name,
    enrollment_no: enrollmentNo,
    user_id: userId,
    branch_id: branchId,
    semester,
    contact_no: contactNo
  };

  const student = await studentManagementModel.createStudent(newStudent);
  return student;
};
