const userModel  = require('../models/userModel');
const sequelize = require('../config/dbConfig');

const getUserId = async (studentIds) => {
    try {
      if (!studentIds || studentIds.length === 0) {
        throw new Error('No student IDs provided');
      }
      
      const Ids = []; // Array to hold results for all student IDs
  
      for (const Id of studentIds) {
        
        const query = `
          SELECT user_id
          FROM student 
          WHERE student_id = :Id;
        `;
  
        // Execute the query
        const results = await sequelize.query(query, {
          replacements: { Id }, // This will replace :Id with the current student ID
          type: sequelize.QueryTypes.SELECT,
        });
  
        if (results.length === 0) {
          throw new Error(`No emails found for student ID: ${Id}`);
        }
  
        Ids.push(...results); // Accumulate results in the array
      }
  
      const allResults = await userModel.getUserEmails(Ids);
  
      return allResults; // Return all results after the loop
    } catch (error) {
      console.error('Error fetching student emails:', error);
      throw error;
    }
  };

  module.exports = { getUserId };