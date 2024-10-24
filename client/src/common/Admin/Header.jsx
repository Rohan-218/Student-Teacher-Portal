import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';  // Use useNavigate for redirection
import './Header.css';  // Import specific styles for Header
import mange_admin from '/src/assets/AdminHeader/human.png';
import logout from '/src/assets/AdminHeader/logout1.png'; 
import password from '/src/assets/AdminHeader/password.png';
import profile from '/src/assets/AdminHeader/profileadmin.jpg';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);  // State to toggle menu visibility on mobile
  const navigate = useNavigate();  // Initialize useNavigate hook for redirection

  const toggleMenu = () => {
    setShowMenu(!showMenu);  // Toggle the menu on profile image click
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove the token from local storage
    navigate('/admin/admin-login');  // Redirect to the login page
  };

  return (
    <div className="navbar">
      <h2>XYZ UNIVERSITY</h2>
      <div className="navbar-right">
        {/* Menu options for larger screens or when profile image is clicked on mobile */}
        <div className={`menu-options ${showMenu ? 'show' : ''}`}>
          <NavLink 
            to="/admin/manage-admin" 
            className={({ isActive }) => isActive ? 'navbar-btn active-link' : 'navbar-btn'}>
            <img src={mange_admin} alt="Manage Admin Icon" className="icon" />
            Manage Admin
          </NavLink>
          <NavLink 
            to="/admin/change-password" 
            className={({ isActive }) => isActive ? 'navbar-btn active-link' : 'navbar-btn'}>
            <img src={password} alt="Change Password Icon" className="icon" />
            Change Password
          </NavLink>
          <NavLink 
            to="/admin/admin-login" 
            className={({ isActive }) => isActive ? 'navbar-btn active-link' : 'navbar-btn'}
            onClick={handleLogout}  // Call handleLogout on Logout click
          >
            {/* Icon added in front of the Logout text */}
            <img src={logout} alt="Logout Icon" className="icon" />
            Logout
          </NavLink>
        </div>
        <img
          src={profile}
          alt="Profile"
          className="profile-img"
          onClick={toggleMenu}  // Toggle menu when the profile image is clicked
        />
      </div>
    </div>
  );
};

export default Header;
