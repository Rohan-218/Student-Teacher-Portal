const sequelize = require('../config/dbConfig');  // Assuming dbConfig exports a sequelize instance
const {secretKey} = require('../config/config.js');

const getUserByEmail = async (email) => {
  try {
      const query = `
          SELECT 
              user_id, 
              email, 
              pgp_sym_decrypt(password::BYTEA, :secretKey) AS decrypted_password, 
              user_type
          FROM 
              users
          WHERE 
              email = :email
      `;
      const result = await sequelize.query(query, {
          replacements: {email, secretKey: secretKey},
          type: sequelize.QueryTypes.SELECT
      });

      return result[0]; // Return the first row (user)
  } catch (error) {
      throw new Error('Error fetching user by email: ' + error.message);
  }
};



// Function to add a token to the blacklist
const isTokenBlacklisted = async (token) => {
    const query = 'SELECT id FROM token_blacklist WHERE token = $1'; // SQL query to select a token from the blacklist
    const values = [token]; // Token parameter
    try {
      const result = await sequelize.query(query, {
        bind: values, // Bind parameters to the query
        type: sequelize.QueryTypes.SELECT // Specify the query type
      }); // Execute the query
      return result.length > 0; // Return true if the token is found, otherwise false
    } catch (error) {
      console.error(`Check Token Error: ${error.message}`); // Handle errors
      throw new Error('Check Token Error');
    }
  };
  
  // Function to insert a token into the blacklist
  const blacklistToken = async (token, expiresAt) => {
    const query = 'INSERT INTO token_blacklist (token, expiresAt) VALUES ($1, $2)'; // SQL query to insert a token into the blacklist
    const values = [token, expiresAt]; // Token and expiration date parameters
    try {
      await sequelize.query(query, {
        bind: values, // Bind parameters to the query
        type: sequelize.QueryTypes.INSERT // Specify the query type
      }); // Execute the query
    } catch (error) {
      console.error(`Insert Token Error: ${error.message}`); // Handle errors
      throw new Error('Insert Token Error');
    }
  };
  

module.exports = {
    getUserByEmail,
    isTokenBlacklisted,
    blacklistToken
};