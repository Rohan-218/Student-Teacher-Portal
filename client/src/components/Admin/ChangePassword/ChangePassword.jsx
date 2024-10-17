import React, { useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import './ChangePassword.css';  

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        email: '',         // Changed to lowercase to match API
        oldPassword: '',   // Changed to lowercase
        newPassword: '',   // Changed to lowercase
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/admin/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token in the headers
                },
                body: JSON.stringify({
                    email: formData.email,           // Use lowercase email
                    oldPassword: formData.oldPassword, // Use lowercase oldPassword
                    newPassword: formData.newPassword, // Use lowercase newPassword
                }),
            });

            // Check if the response is okay
            if (!response.ok) {
                const errorData = await response.json(); // Extract error message from response
                throw new Error(errorData.message || 'Failed to change password');
            }

            const data = await response.json();
            setSuccessMessage(data.message || 'Password changed successfully');
            setError(''); // Clear any previous errors

            // Display success message in alert box
            window.alert(data.message || 'Password changed successfully');
            // Reset the form after successful submission
            handleCancel();
        } catch (err) {
            setError(err.message);
            // Display error message in alert box
            window.alert(err.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            email: '',          // Reset to lowercase
            oldPassword: '',    // Reset to lowercase
            newPassword: '',    // Reset to lowercase
        });
        setError(''); // Clear error message
        setSuccessMessage(''); // Clear success message
    };

    return (
        <>
         <Header />
            <Sidebar />
        <div className="changepassword-list">
            <div className="main-content">
                <div className="container">
                    <main className="c-form-container">
                        <h2>Change Password</h2>
                        {error && <div className="error-message">{error}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    className="input"
                                    type="email"
                                    name="email" // Use lowercase to match state
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Old Password:</label>
                                <input
                                    className="input"
                                    type="password"
                                    name="oldPassword" // Use lowercase
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    className="input"
                                    type="password"
                                    name="newPassword" // Use lowercase
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button className="btn-c" type="button" onClick={handleCancel}>Clear</button>
                                <button className="btn-c" type="submit">Submit</button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
        </>
    );
};

export default ChangePassword;
