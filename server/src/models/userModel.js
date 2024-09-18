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
    blacklistToken
};