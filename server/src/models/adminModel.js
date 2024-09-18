// adminService.js
const sequelize = require('../config/dbConfig'); 
const { secretKey } = require('../config/config.js');

// Get Admins Service
exports.getAdmins = async (requesting_user_id) => {
  try {
      console.log('Executing query to fetch admins...');
      const results = await sequelize.query(`
        SELECT 
          a.name AS admin_name, 
          u.email, 
          CASE 
            WHEN r.user_type = 0 THEN pgp_sym_decrypt(u.password::BYTEA, :secretKey)  -- Decrypt password if superadmin
            ELSE '********'  -- Mask password for other users
          END AS password, 
          u.is_active
        FROM admin a
        JOIN users u ON a.user_id = u.user_id  -- Adjusted to u.user_id assuming 'user_id' is the correct column
        JOIN users r ON r.user_id = :requesting_user_id  -- Adjusted to r.user_id assuming 'user_id' is the correct column
        WHERE u.user_type IN (0, 3); 
      `, {
        replacements: { 
          requesting_user_id,  // Use the user_id from the token
          secretKey  // Decryption key
        },
        type: sequelize.QueryTypes.SELECT
      });

      return results;
  } catch (error) {
      console.error('Error fetching admin data:', error);
      throw new Error('Error fetching admin data: ' + error.message);
  }
};
