import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import './Login.css';
import loginLogo from '/src/assets/Portal/Login/login-logo.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState(''); // New state for alert message
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message on new attempt

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        handleLoginSuccess(result.token);
      } else {
        handleLoginError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleLoginSuccess = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
      localStorage.setItem('tokenExpiration', expirationTime);

      const decodedToken = jwtDecode(token);
      console.log('User ID:', decodedToken.user_id);
      
      if (decodedToken.user_type === 1) {
        setMessage('Login successful!'); // Student
        setTimeout(() => navigate('/student-dashboard'), 1000);
      } else if (decodedToken.user_type === 2) {
        setMessage('Login successful!'); // Teacher
        setTimeout(() => navigate('/teacher-dashboard'), 1000);
      } else {
        setMessage('Not authorized.'); // For any other user type
      }
    } else {
      setMessage('Login failed: No token received.');
    }
  };

  const handleLoginError = (errorMessage) => {
    setMessage(errorMessage || 'Login failed. Please check your credentials.');
  };

  const checkTokenExpiration = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();
    
    if (expirationTime && currentTime > expirationTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      setAlertMessage('Session expired. Please log in again.'); // Set alert message
      setTimeout(() => navigate('/login'), 1000); // Redirect user after 1 second
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev); // Toggle password visibility
  };

  return (
    <div className='slogin-page'>
      <div className="ssidebar-section">
        <div className="sprofile-image-container">
          <img
            src={loginLogo}
            alt="Profile"
            className="sprofile-image"
          />
        </div>
      </div>
      <div className="login-container">
        <div className='sform'>
          <h1 className='login-h1'>Login</h1>
          <form onSubmit={onSubmitForm}>
            <div className="input-group">
              <label className='slabel'>Email:</label>
              <input className='input'
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className='slabel'>Password:</label>
              <div className="password-container"> {/* Wrap the input and icon */}
                <input className='input'
                  type={showPassword ? "text" : "password"} // Toggle input type
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />} {/* Eye icon */}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-login-button">Login</button>
          </form>
          {message && (
            <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
          {/* Alert box for session expiration */}
          {alertMessage && (
            <div className="alert-box">
              {alertMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
