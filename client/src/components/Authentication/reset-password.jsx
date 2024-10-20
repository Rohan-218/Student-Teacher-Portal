import React, { useState } from "react";
import './reset-password.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState(''); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // State for error messages

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        
        // If passwords match, reset the error and continue with the reset logic
        setError("");
        setMessage(`Password changed successfully and sent to ${email}`);
        
        // API
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev); 
    };

    return (
        <div className="pass-page">
            <div className="pass-form">
                <strong>Reset Password</strong>
                <p>Please provide the following details.</p>
                <form onSubmit={handleSubmit}>
                    <div className="pass-container">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        
                        <label>Set New Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="Toggle-password"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        </div>

                        <label>Confirm Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button className="pass-button">Send</button>
                      {/* Display error message if passwords do not match */}
                      {error && <p className="error-message">{error}</p>}
                         {/* Display success message */}
                {message && <p className="success-message">{message}</p>}
                </form>
              </div>
        </div>
    );
};

export default ResetPassword;
