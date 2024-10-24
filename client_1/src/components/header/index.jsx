import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // For routing
import './index.css'; // Import the CSS file
import profile from '/src/assets/Navbar/profileadmin.jpg';
import account from '/src/assets/Navbar/admin.png';
import contact from '/src/assets/Navbar/contact.png';
import info from '/src/assets/Navbar/informationicon.webp';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate(); 

  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  const toggleDropdown = () => {
    if (isLoggedIn) {
      setShowDropdown((prevState) => !prevState);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    setIsLoggedIn(false); 

    if (!isHomePage) {
      navigate('/login');
    }
    setShowDropdown(false);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, [location, setIsLoggedIn]);

  const handleNavigateAndScroll = (section) => {
    if (!isHomePage) {
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
        <div
         className={`snavprofile-container ${!isLoggedIn || isHomePage || isLoginPage ? 'disabled' : ''}`} 
        onClick={toggleDropdown} ref={profileRef}>
          <img src={profile} alt="Profile" className={`snavprofile-img ${!isLoggedIn || isHomePage || isLoginPage ? 'unclickable' : ''}`}/>
          {showDropdown  && isLoggedIn && (
            <div className="profile-dropdown">
                <p>Hello User!</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
