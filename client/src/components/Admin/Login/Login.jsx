import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Importing eye icons
import './Login.css';

import photo from '/src/assets/Admin/Login/login.jpeg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [alertMessage, setAlertMessage] = useState(''); // New state for session expiration alert
  const navigate = useNavigate();
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime < expirationTime) {
      const timeRemaining = expirationTime - currentTime;
      const timeoutId = setTimeout(() => {
        checkTokenExpiration();
      }, timeRemaining);

      return () => clearTimeout(timeoutId); // Cleanup on unmount
    } else {
      checkTokenExpiration(); // Immediately check if token is expired
    }
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      const body = { email, password: encryptedPassword };
      const response = await fetch("http://192.168.29.80:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.token;

        if (token) {
          localStorage.setItem('token', token);
          const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Token expiration in 1 hour
          localStorage.setItem('tokenExpiration', expirationTime);

          const decodedToken = jwtDecode(token);

          if (decodedToken.user_type === 0 || decodedToken.user_type === 3) {
            setMessage('Login successful!');
            setTimeout(() => {
              navigate('/admin/dashboard');
            }, 1000);
          } else {
            setMessage('Not authorized to access the dashboard.');
          }
        } else {
          setMessage('Token not received.');
        }
      } else {
        setMessage(result.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err.message);
      setMessage('An error occurred during login.');
    }
  };

  const checkTokenExpiration = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime > expirationTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      setAlertMessage('Session expired. Please log in again.');
      setTimeout(() => navigate('/'), 1000); // Redirect after 1 second
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev); // Toggle password visibility
  };

  return (
    <div className="adlogin-page-container">
      <nav className="adnavbar-container">
         <NavLink to="/" className="adnavbar-link">
          XYZ UNIVERSITY
         </NavLink>
      </nav>
      <div className="adcontent-wrapper">
        <div className="adsidebar-section">
          <div className="adprofile-image-container">
            <div className='adimage-container'>
              <img
                src= {photo}
                alt="Profile"
                className="adprofile-image"
              />
            </div>
            
            <div className="adsidebar-title">
              <h2>Admin Panel</h2>
            </div>
          </div>
          
        </div>
        
        <div className="adlogin-form-container">
          <div className='login-form-container'>
            <h1>Login</h1>
            <form onSubmit={onSubmitForm}>
              <div className="adinput-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="adinput-group">
                <label>Password:</label>
                <div className="Password-Input-Container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="Password-Icon"
                    onClick={togglePasswordVisibility} // Toggle password visibility
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>
              <button type="submit">Login</button>
            </form>
            {message && <p className={message.includes('successful') ? 'adsuccess-message' : 'aderror-message'}>{message}</p>}
            
            {/* Alert box for session expiration */}
            {alertMessage && (
              <div className="alert-box">
                {alertMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
