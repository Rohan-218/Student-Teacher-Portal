const cron = require('node-cron');
const { getAllTokens, blacklistExpiredTokens } = require('../models/tokenBlacklistModel');
require('dotenv').config();

const runTask = async () => {
    console.log('Running task to blacklist expired tokens...');
    try {
        const tokens = await getAllTokens();

        const expiredTokens = [];

        for (const token of tokens) {
            try {
            } catch (tokenError) {
                if (tokenError.name === 'TokenExpiredError') {
                    console.error(`Token expired: ${token.token}`);
                    expiredTokens.push(token);
                } else {
                    console.error(`Error verifying token ${token.token}: ${tokenError.message}`);
                }
            }
        }
        const result = await blacklistExpiredTokens();
    } catch (error) {
        console.error(`Error during the blacklist token cron job: ${error.message}`);
    }
};

if (process.env.NODE_ENV === 'production') {
    cron.schedule('*/5 * * * *', runTask);
}

console.log('Cron job scheduled to run every 5 minutes.');
