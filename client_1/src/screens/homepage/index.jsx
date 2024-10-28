import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUs from '../about-us/AboutUs.jsx';
import Contact from '../contact-us/Contact.jsx';
import Header from '../../components/header/index.jsx';
import {LoginButton} from '../../components/button/styles.jsx';
import {jwtDecode} from 'jwt-decode';
import './index.css';
import profile from '/src/assets/Portal/HomePage/home project image.png';
import linkedIn from '/src/assets/Portal/HomePage/linkedin.png';
import insta from '/src/assets/Portal/HomePage/instagram.png';
import twitter from '/src/assets/Portal/HomePage/twitter.png';

const Index = () => {
  const aboutRef = useRef(null); 
  const contactRef = useRef(null);
  const navigate = useNavigate();
  const [button, setButton] = useState('LOGIN');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { user_type } = decodedToken;

        if (user_type === 1 || user_type === 2) {
          setButton('Go To Profile');
          setIsLoggedIn(true);
        } else {
          setButton('Login');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setButton('Login');
        setIsLoggedIn(false);
      }
    } else {
      setButton('Login');
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      const { user_type } = decodedToken;

      if (user_type === 1) {
        navigate('/student-dashboard'); 
      } else if (user_type === 2) {
        navigate('/teacher-dashboard');  
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login'); 
    }
  };

  return (
  <>
    <Header /> 
        <div id="top" className="homepage-container">
            <div className="homepage-content">
                <div className="left-section">
                <h1 className="large-text">Welcome to</h1>
                <h1 className="text">XYZ UNIVERSITY</h1>
                    <p className="motto">"Together We Learn, Together We Succeed."</p>
                <LoginButton onClick={handleLoginClick}>{button}</LoginButton>
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
                <div>
                <p className="copyright">Copyright © 2022 XYZ University. All rights reserved.</p>
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
        </>
  );
};

export default Index;
