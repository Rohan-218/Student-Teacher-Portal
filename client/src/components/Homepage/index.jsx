import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUs from './about-us/AboutUs.jsx';
import Contact from './contact-us/Contact.jsx';
// import Navbar from '../Common/navbar/Navbar.jsx';   Import the Navbar component
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode
import './index.css';

import profile from '/src/assets/Portal/HomePage/home2.png';
import linkedIn from '/src/assets/Portal/HomePage/linkedin.png';
import insta from '/src/assets/Portal/HomePage/instagram.png';
import twitter from '/src/assets/Portal/HomePage/twitter.png';

const Index = () => {
  const aboutRef = useRef(null);  // Ref for About Us section
  const contactRef = useRef(null);
  const navigate = useNavigate();
  const [button, setButton] = useState('LOGIN');  // Default button text
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Token state management

  // Check token and set button text based on user type
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { user_type } = decodedToken; // Extract user_type from token

        // If user_type is 1 or 2, show "GO TO PROFILE" button
        if (user_type === 1 || user_type === 2) {
          setButton('GO TO PROFILE');
          setIsLoggedIn(true);
        } else {
          // If user_type is not 1 or 2, show "LOGIN" button
          setButton('LOGIN');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setButton('LOGIN');  // Set to LOGIN in case of any error
        setIsLoggedIn(false);
      }
    } else {
      setButton('LOGIN');
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  // Handle button click for navigation
  const handleLoginClick = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      const { user_type } = decodedToken;

      if (user_type === 1) {
        navigate('/student-dashboard');  // Navigate to student dashboard
      } else if (user_type === 2) {
        navigate('/teacher-dashboard');  // Navigate to teacher dashboard
      } else {
        // If user_type is invalid, navigate to login
        navigate('/login');
      }
    } else {
      navigate('/login');  // Navigate to login if no token
    }
  };

  return (
    <div id="top" className="homepage-container">
      {/* <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> Pass state */}
      <div className="homepage-content">
        <div className="left-section">
          <h1 className="large-text">Welcome to</h1>
          <h1 className="text">XYZ UNIVERSITY</h1>
            <p className="motto">"Together We Learn, Together We Succeed."</p> {/* Motto example */}
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
      <hr />
      <div className='footer'>
        
        {/* <a href="#top">Back to Top</a> */}
        <div>
          <p className="copyright">Copyright © 2022 XYZ University. All rights reserved.</p> {/* Copyright notice */}
        </div>
        <div className='footer-logo'>
            <div className="footer-icon" ><img 
            src={linkedIn}
            alt="linkedIn"         
            />
            </div>
            <div className="footer-icon" >
            <img 
            src={insta}
            alt="instagram"             
            />
            </div>
            <div className="footer-icon" >
            <img 
            src={twitter}
            alt="twitter" 
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
