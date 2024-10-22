import React, { useState } from "react";
import './reset-password.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons
import CryptoJS from 'crypto-js';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false); 
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); 
    const secretKey = import.meta.env.VITE_SECRET_KEY;
   
    const [formData, setFormData] = useState({
        email: '',     
        oldPassword: '',   
        newPassword: '',   
        confirmPassword: '', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setError("");

        try {
            const encryptedOldPassword = CryptoJS.AES.encrypt(formData.oldPassword, secretKey).toString();
            const encryptedNewPassword = CryptoJS.AES.encrypt(formData.newPassword, secretKey).toString();

            const response = await fetch('http://localhost:3000/api/users/reset-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    oldPassword: encryptedOldPassword,
                    newPassword: encryptedNewPassword
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            const data = await response.json();
            setMessage(data.message || 'Password changed successfully');
            setError('');
            window.alert(data.message || 'Password changed successfully');
            handleCancel();
        } catch (err) {
            setError(err.message);
            window.alert(err.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            email: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label>Old Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <label>Set New Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
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
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button className="pass-button">Send</button>

                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
