import { useState, useEffect, useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll'; // For smooth scrolling
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // For routing
import './Navbar.css'; // Import the CSS file
import profile from '/src/assets/AdminHeader/profileadmin.jpg';
import account from '/src/assets/Navbar_icon/admin.png';
import contact from '/src/assets/Navbar_icon/contact.png';
import home from '/src/assets/Navbar_icon/home-page-white-icon.webp';
import info from '/src/assets/Navbar_icon/informationicon.webp';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation(); // Get the current path
  const [showDropdown, setShowDropdown] = useState(false); // State to show/hide dropdown box
  const profileRef = useRef(null); // Reference to profile container
  const navigate = useNavigate(); // For navigation after logout

  const isHomePage = location.pathname === '/';

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState); // Toggle the dropdown box
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update state

    if (!isHomePage) {
      navigate('/login');
    }
    setShowDropdown(false); // Hide dropdown after logout
  };

  // Close the dropdown when clicking outside the profile container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set login status based on token presence
  }, [location, setIsLoggedIn]);

  const handleNavigateAndScroll = (section) => {
    if (!isHomePage) {
      // Navigate back to the homepage and scroll to the section
      navigate('/');
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to ensure page has loaded before scrolling
    } else {
      // If already on the homepage, just scroll to the section
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='snav'>
      <div className="snavlogo-sli"  onClick={() => handleNavigateAndScroll('top')}>
        XYZ UNIVERSITY
        </div>
      <div className='sul'>
        {isHomePage && (
          <div className="sli">
            <RouterLink to="/admin/admin-login" className="snav-link">
              <img src={account} alt="Admin Login" className="icon" />
              Admin Login
            </RouterLink>
          </div>
        )}

        {/* <div className='sli'>
          <span className="snav-link" onClick={() => handleNavigateAndScroll('top')}>
            <img src={home} alt="Home Icon" className="icon1" />
            Home
          </span>
        </div> */}

        <div className='sli'>
          <span className="snav-link" onClick={() => handleNavigateAndScroll('about-us')}>
            <img src={info} alt="About Us Icon" className="icon4" />
            About Us
          </span>
        </div>

        <div className='sli'>
          <span className="snav-link" onClick={() => handleNavigateAndScroll('contact')}>
            <img src={contact} alt="Contact Icon" className="icon2" />
            Contact
          </span>
        </div>

        {/* Profile Image */}
        <div className="snavprofile-container" onClick={toggleDropdown} ref={profileRef}>
          <img src={profile} alt="Profile" className="snavprofile-img" />
          {showDropdown && (
            <div className="profile-dropdown">
              <p>Hello User!</p>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="snavbutton slogout-button">Logout</button>
              ) : (
                <RouterLink to="/login">
                  <button className="snavbutton slogin-button">Login</button>
                </RouterLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
