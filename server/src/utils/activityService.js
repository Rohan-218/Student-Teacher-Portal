const sequelize = require('../config/dbConfig');  // Adjust the path accordingly

const insertActivity = async (userId, eventType, message) => {
  const query = `
    INSERT INTO user_activity (user_id, timestamp, event_type, message)
    VALUES (:user_id, NOW(), :event_type, :message)
  `;

  try {
    await sequelize.query(query, {
      replacements: {
        user_id: userId,
        event_type: eventType,
        message: message,
      },
    });
    console.log('Activity inserted successfully');
  } catch (error) {
    console.error('Error inserting activity:', error);
  }
};

module.exports = { insertActivity };
