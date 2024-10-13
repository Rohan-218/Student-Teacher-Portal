const sequelize = require('../config/dbConfig');
const { secretKey } = require('../config/config.js');

// Create a new user in the users table with encrypted password and user_type set to 2 (for teacher)
exports.createUser = async (email, password) => {
  const userType = 2; // Set user_type to 2 (for teacher)

  if (!secretKey) {
    throw new Error('Secret key is not defined in the environment variables');
  }

  try {
    const userQuery = `
      INSERT INTO users (email, password, user_type)
      VALUES (:email, pgp_sym_encrypt(:password, :secretKey), :userType)
      RETURNING user_id;
    `;
    const userResult = await sequelize.query(userQuery, {
      replacements: { email, password, secretKey, userType },
      type: sequelize.QueryTypes.INSERT
    });

    return userResult[0][0].user_id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
};

// Create a new teacher in the teacher table
exports.createTeacher = async (name, designation, userId, contactNo) => {
  try {
    const teacherQuery = `
      INSERT INTO teacher (teacher_name, designation, user_id, contact_no)
      VALUES (:name, :designation, :userId, :contactNo)
      RETURNING teacher_id;
    `;

    const teacherResult = await sequelize.query(teacherQuery, {
      replacements: { name, designation, userId, contactNo },
      type: sequelize.QueryTypes.INSERT
    });

    return teacherResult[0][0].teacher_id;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw new Error('Error creating teacher');
  }
};

// Get subject_id by subject_code
exports.getSubjectIdByCode = async (subjectCode) => {
  try {
    const query = 'SELECT subject_id FROM subject WHERE subject_code = :subjectCode';
    const result = await sequelize.query(query, {
      replacements: { subjectCode: subjectCode },
      type: sequelize.QueryTypes.SELECT
    });

    return result.length > 0 ? result[0].subject_id : null;
  } catch (error) {
    console.error('Error getting subject_id by code:', error);
    throw new Error('Error fetching subject_id');
  }
};

// Assign a subject to a teacher in the subject_teacher table
exports.assignSubjectToTeacher = async (teacherId, subjectId) => {
  try {
    const query = `
      INSERT INTO subject_teacher (teacher_id, subject_id)
      VALUES (:teacherId, :subjectId);
    `;
    await sequelize.query(query, {
      replacements: { teacherId, subjectId },
      type: sequelize.QueryTypes.INSERT
    });
  } catch (error) {
    console.error('Error assigning subject to teacher:', error);
    throw new Error('Error assigning subject to teacher');
  }
};
