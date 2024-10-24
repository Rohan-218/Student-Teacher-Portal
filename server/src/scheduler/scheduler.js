const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const { getAllTokens, blacklistExpiredTokens } = require('../models/tokenBlacklistModel'); // Ensure correct path
const { logUserLogout } = require('../models/userLogModel'); // Ensure correct path
require('dotenv').config({ path: 'src/.env' });

// Task function to blacklist expired tokens
const runTask = async () => {
    console.log('Running task to blacklist expired tokens...');
    try {
        const tokens = await getAllTokens(); // Fetch tokens from the database

        const expiredTokens = []; // Array to store expired tokens for logging

        for (const token of tokens) {
            try {
                const decoded = jwt.verify(token.token, process.env.JWT_SECRET); // Ensure 'token' is the correct field
                console.log(`Processing token for user ID: ${decoded.user_id}`);
            } catch (tokenError) {
                if (tokenError.name === 'TokenExpiredError') {
                    console.error(`Token expired: ${token.token}`);
                    expiredTokens.push(token); // Add the token to the list of expired tokens
                } else {
                    console.error(`Error verifying token ${token.token}: ${tokenError.message}`);
                }
            }
        }

        // Blacklist expired tokens
        const result = await blacklistExpiredTokens();
        console.log(result.success);

        console.log('Expired tokens have been successfully blacklisted.');
    } catch (error) {
        console.error(`Error during the blacklist token cron job: ${error.message}`);
    }
};

// Schedule the task to run every 5 minutes
cron.schedule('*/5 * * * *', runTask);

console.log('Cron job scheduled to run every 5 minutes.');
