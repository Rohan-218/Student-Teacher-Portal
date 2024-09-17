const sequelize = require('../config/dbConfig');  // Assuming dbConfig exports a sequelize instance

exports.getUserByEmail = async (email) => {
    try {
        const query = `
            SELECT user_id, email, password, user_type
            FROM users
            WHERE email = :email
        `;
        const [result] = await sequelize.query(query, {
            replacements: { email },
            type: sequelize.QueryTypes.SELECT
        });

        return result;
    } catch (error) {
        throw new Error('Error fetching user by email: ' + error.message);
    }
};
