import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll'; // For smooth scrolling
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // For routing
import './Navbar.css'; // Import the CSS file
import profile from '/src/assets/AdminHeader/profileadmin.jpg'
import account from '/src/assets/Navbar_icon/admin-panel.png'
import contact from '/src/assets/Navbar_icon/contact.png'
import home from '/src/assets/Navbar_icon/home-page-white-icon.webp'
import info from '/src/assets/Navbar_icon/informationicon.webp'

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {  // Receive props
  const location = useLocation(); // Get the current path
  const [showLogout, setShowLogout] = useState(false); // State to show/hide logout button
  const navigate = useNavigate(); // For navigation after logout

  const isHomePage = location.pathname === '/';

  const toggleLogout = () => {
    setShowLogout((prevShowLogout) => !prevShowLogout);
  };

  const handleLogout = () => {
    // Remove the token from local storage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false);  // Ensure isLoggedIn is updated

    if (!isHomePage) {
      navigate('/login');
    }
  };

  // Check token on component mount or location change to determine login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // Set to logged in if token exists
    } else {
      setIsLoggedIn(false); // Set to logged out if no token exists
    }

    setShowLogout(false); // Hide logout button on page load or navigation
  }, [location, setIsLoggedIn]);

  return (
    <div className='snav'>
       <div  className="snavlogo-sli">XYZ UNIVERSITY</div>
      <div className='sul'>
        {isHomePage && (
          <div className="sli">
            <RouterLink to="/admin/admin-login" className="snav-link">
            <img 
                src={account}
                alt="Home Icon" 
                className="icon" 
              />
              Admin Login
            </RouterLink>
          </div>
        )}

        <div className='sli'>
          {isHomePage ? (
            <ScrollLink to="top" smooth={true} duration={500} className="snav-link">
              <img 
                src={home} 
                alt="Home Icon" 
                className="icon1" 
              />
              Home
            </ScrollLink>
          ) : (
            <RouterLink to="/" className="snav-link">
              <img 
                src={home}
                alt="Home Icon" 
                className="icon1" 
              />
              Home
            </RouterLink>
          )}
        </div>

        <div className='sli'>
          {isHomePage ? (
            <ScrollLink to="about-us" smooth={true} duration={500} className="snav-link">
              <img 
                src={info} 
                alt="About Us Icon" 
                className="icon4" 
              />
              About Us
            </ScrollLink>
          ) : (
            <RouterLink to="/about-us" className="snav-link">
              <img 
                src={info} 
                alt="About Us Icon" 
                className="icon1" 
              />
              About Us
            </RouterLink>
          )}
        </div>

        <div className='sli'>
          {isHomePage ? (
            <ScrollLink to="contact" smooth={true} duration={500} className="snav-link">
              <img 
                src={contact}
                alt="Contact Icon" 
                className="icon2" 
              />
              Contact
            </ScrollLink>
          ) : (
            <RouterLink to="/contact" className="snav-link">
              <img 
                src={contact} 
                alt="Contact Icon" 
                className="icon2" 
              />
              Contact
            </RouterLink>
          )}
        </div>

        <div className="snavprofile-container sli" onClick={toggleLogout}>
          <img
            src={profile}
            alt="Profile"
            className="snavprofile-img"
          />
          {isLoggedIn && showLogout && (
            <button onClick={handleLogout} className="snavbutton slogout-button">
              Logout
            </button>
          )}
          {!isLoggedIn && showLogout && (
            <RouterLink to="/login" className="snavbutton slogin-button">
              Login
            </RouterLink>
          )}
        </div>
      </div>
    </div>
  );
}; 
export default Navbar;