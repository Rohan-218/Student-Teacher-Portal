import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUs from './about-us/AboutUs.jsx';
import Contact from './contact-us/Contact.jsx';
import Navbar from '../Common/navbar/Navbar.jsx';  // Import the Navbar component
import './index.css';
import profile from '/src/assets/AdminHeader/home.jpg';
const Index = () => {
  const aboutRef = useRef(null);  // Ref for About Us section
  const contactRef = useRef(null);
  const navigate = useNavigate();
  const [button, setButton] = useState('LOGIN');  // Default button text
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Token state management

  // Set button text based on token presence
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setButton('GO TO PROFILE');
      setIsLoggedIn(true);
    } else {
      setButton('LOGIN');
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);  // Run whenever `isLoggedIn` changes

  const handleLoginClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to student dashboard if token exists
      navigate('/student-dashboard');
    } else {
      // Navigate to login page if no token
      navigate('/login');
    }
  };

  return (
    <div id="top" className="homepage-container">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Pass state */}
      {/* New wrapper for flex layout */}
      <div className="homepage-content">
        <div className="left-section">
          <h1 className="large-text">Welcome to</h1>
          <h1 className="text">XYZ UNIVERSITY</h1>
          <button className="button" onClick={handleLoginClick}>{button}</button>
        </div>

        <div className="right-section">
          <img 
            src={profile}
            alt="University" 
            className="background-image" 
          />
        </div>
      </div>

      <div ref={aboutRef} id="about-us">
        <AboutUs />
      </div>

      <div ref={contactRef} id="contact">
        <Contact />
      </div>
    </div>
  );
};

export default Index;
