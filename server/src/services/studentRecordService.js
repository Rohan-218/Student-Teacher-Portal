const studentRecordModel = require('../models/studentRecordModel');

exports.getAllStudents = async () => {
  try {
    const students = await studentRecordModel.getAllStudents();
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};


// New service method to get students by branch and semester
exports.getStudentsByBranchAndSemester = async (branchName, semester) => {
    try {
      const students = await studentRecordModel.getStudentsByBranchAndSemester(branchName, semester);
      return students;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
// New service method to search students by name
exports.searchStudentsByName = async (name) => {
    try {
      const students = await studentRecordModel.searchStudentsByName(name);
      return students;
    } catch (error) {
      throw new Error(error.message);
    }
};