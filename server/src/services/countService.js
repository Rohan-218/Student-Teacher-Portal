const countModel = require('../models/countModel');

const countService = {
  getStudentCount: () => {
    return countModel.getStudentCount();
  },
  
  getTeacherCount: () => {
    return countModel.getTeacherCount();
  },

  getSubjectCount: () => {
    return countModel.getSubjectCount();
  },

  getBranchCount: () => {
    return countModel.getBranchCount();
  },

  getStudentBranchCount: () => {
    return countModel.getStudentBranchCount();
  }
};

module.exports = countService;
