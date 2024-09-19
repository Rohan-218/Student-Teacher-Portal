const teacherRecordModel = require('../models/teacherRecordModel');

// Fetch all teachers
exports.getAllTeachers = async () => {
  try {
    return await teacherRecordModel.getAllTeachers();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch teachers by branch and semester
exports.getTeachersByBranchAndSemester = async (branchName, semester) => {
  try {
    return await teacherRecordModel.getTeachersByBranchAndSemester(branchName, semester);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Search teachers by name
exports.searchTeachersByName = async (name) => {
  try {
    return await teacherRecordModel.searchTeachersByName(name);
  } catch (error) {
    throw new Error(error.message);
  }
};
