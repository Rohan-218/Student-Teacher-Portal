const sequelize = require('../config/dbConfig.js');
const {secretKey} = require('../config/config.js');

exports.updatePasswordAdmin = async (user_id, newPassword) => {
  try {
    const query = `
      UPDATE users
      SET password = pgp_sym_encrypt(:newPassword, :secretKey), updated_at = NOW()
      WHERE user_id = :user_id AND user_type IN (0, 3);
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
      throw new Error("Can't update student or teacher password.");
    }
    
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
