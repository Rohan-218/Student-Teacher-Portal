import React, { useState } from "react";
import './reset-password.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState(''); // Updated variable name
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Implement your password reset logic here
        // For example, send a request to your API
        setMessage(`Password changed successfully and send to ${email}`);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev); // Toggle password visibility
    };

    return (
        <div className="pass-page">
        <div className="pass-form">
            <strong>Reset Password</strong>
            <p>Please enter your details.</p>
            <form onSubmit={handleSubmit}>
                <div className="pass-container">
                     <label>Email : </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label>Set New Password :</label>
                    <div> {/* Wrap the input and icon */}
                        <input
                            type={showPassword ? "text" : "password"} // Toggle input type
                            value={newPassword} // Use newPassword here
                            onChange={e => setNewPassword(e.target.value)} // Update state correctly
                            required
                        />
                        <button className="Toggle-password" onClick={togglePasswordVisibility}>
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />} {/* Eye icon */}
                        </button>
                    </div>
                </div>
                <button className="pass-button">Send</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default ResetPassword;
