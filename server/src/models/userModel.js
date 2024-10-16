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
              AND is_active = TRUE
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

const storeToken = async (user_id, token, expires_at, created_at, is_blacklisted) => {
  const query = `
    INSERT INTO token_blacklist (user_id, token, expires_at, is_blacklisted, created_at) 
    VALUES (:user_id, :token, :expires_at, :is_blacklisted, :created_at)
    `;
  await sequelize.query(query, {
      replacements: { user_id, token, expires_at, created_at, is_blacklisted },
  });
};

  
  // Function to insert a token into the blacklist
  const blacklistToken = async (token) => {
    try {
        const query = `UPDATE token_blacklist SET is_blacklisted = TRUE WHERE token = :token`;
        await sequelize.query(query, {
            replacements: { token },
        });
        return true; // Return true indicating the token was successfully blacklisted
    } catch (error) {
        console.error(`Blacklist Token Error: ${error.message}`); // Handle errors
        throw new Error('Blacklist Token Error'); // Throw error for upstream handling
    }
};
  

const getUserEmails = async (userIds) => {
    try {
      
      if (!userIds || userIds.length === 0) {
        throw new Error('No User IDs provided');
      }
      
      const allResults = []; // Array to hold results for all student IDs
  
      for (const obj of userIds) {
        const { user_id } = obj;
        
        const query = `
          SELECT email FROM users
          WHERE user_id = :user_id;
        `;
  
        // Execute the query
        const results = await sequelize.query(query, {
          replacements: { user_id }, // Use the extracted user_id
          type: sequelize.QueryTypes.SELECT,
        });
  
        if (results.length === 0) {
          throw new Error(`No emails found for User ID: ${user_id}`);
        }
  
        allResults.push(...results); // Accumulate results in the array
      }
  
      return allResults; // Return all results after the loop
    } catch (error) {
      console.error('Error fetching user emails:', error);
      throw error;
    }
  };
  

module.exports = {
    getUserByEmail,
    blacklistToken,
    storeToken,
    getUserEmails
};