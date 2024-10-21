const { getUserByEmail } = require('../models/userModel');
const { updatePasswordAdmin } = require('../models/updatePasswordAdminModel');

exports.updatePasswordAdmin = async (email, oldPassword, newPassword) => {
  try {
    // Step 1: Fetch user by email
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Verify decrypted old password
    if (user.decrypted_password !== oldPassword) {
      throw new Error('Old password is incorrect');
    }

    // Step 3: Encrypt new password and update 
    await updatePasswordAdmin(user.user_id, newPassword);

    return { success: true, data:user.user_id, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Update Password Service Error:', error.message);
    throw new Error(error.message);
  }
};
