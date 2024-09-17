// In your authService.js file
const db = require('../config/dbConfig'); // Ensure you import the correct dbConfig

exports.logout = async (token) => {
    try {
        // Check if the token is already blacklisted
        const [result] = await db.query(
            'SELECT "id", "token", "expiresat" FROM "token_blacklist" WHERE "token" = $1',
            {
                bind: [token],
                type: db.QueryTypes.SELECT
            }
        );

        if (result.length > 0) {
            return { success: false, message: 'Token already logged out' };
        }

        // Add token to the blacklist
        await db.query(
            'INSERT INTO "token_blacklist" ("token", "expiresat") VALUES ($1, $2)',
            {
                bind: [token, new Date()],
                type: db.QueryTypes.INSERT
            }
        );

        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Logout Service Error:', error);
        throw new Error('Logout Service Error');
    }
};
