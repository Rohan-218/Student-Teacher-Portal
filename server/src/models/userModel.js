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
  

const getUserData = async (userIds) => {
  try {
    // Check if a single user_id is sent and convert it to an array of objects
    if (!Array.isArray(userIds)) {
      userIds = [{ user_id: userIds }]; // Convert single user_id to array
    }

    if (!userIds || userIds.length === 0) {
      throw new Error('No User IDs provided');
    }

    const allResults = []; // Array to hold results for all user IDs

    for (const obj of userIds) {
      const { user_id } = obj;

      // Step 1: Fetch the user_type from the users table
      const userTypeQuery = `
        SELECT user_type FROM users WHERE user_id = :user_id;
      `;

      const userTypeResult = await sequelize.query(userTypeQuery, {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      });

      if (userTypeResult.length === 0) {
        throw new Error(`No user found for User ID: ${user_id}`);
      }

      const user_type = userTypeResult[0].user_type;

      // Step 2: Run different queries based on user_type
      let query = '';
      if (user_type === 0 || user_type === 3) {
        // Fetch from admin table
        query = `
          SELECT u.email, a.name FROM users u
          JOIN admin a ON u.user_id = a.user_id
          WHERE u.user_id = :user_id;
        `;
      } else if (user_type === 1) {
        // Fetch from student table
        query = `
          SELECT u.email, s.student_name as name FROM users u
          JOIN student s ON u.user_id = s.user_id
          WHERE u.user_id = :user_id;
        `;
      } else if (user_type === 2) {
        // Fetch from teacher table
        query = `
          SELECT u.email, t.teacher_name as name FROM users u
          JOIN teacher t ON u.user_id = t.user_id
          WHERE u.user_id = :user_id;
        `;
      } else {
        throw new Error(`Invalid user type for User ID: ${user_id}`);
      }

      // Step 3: Execute the corresponding query
      const results = await sequelize.query(query, {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      });

      if (results.length === 0) {
        throw new Error(`No data found for User ID: ${user_id}`);
      }

      allResults.push(...results); // Accumulate results in the array
    }

    return allResults; // Return all results after the loop
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


const updateUserPassword = async (user_id, newPassword) => {
  try {
    const query = `
      UPDATE users
      SET password = pgp_sym_encrypt(:newPassword, :secretKey), updated_at = NOW()
      WHERE user_id = :user_id AND user_type IN (1, 2);
    `;
    
    const [result, metadata] = await sequelize.query(query, {
      replacements: {
        user_id,
        newPassword,
        secretKey,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    console.log(result, metadata);
    if (metadata === 0) {
      throw new Error("only Student and Teachers can update password.");
    }
    
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
  

module.exports = {
    getUserByEmail,
    blacklistToken,
    storeToken,
    updateUserPassword,
    getUserData
};