import React, { useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';  // Import specific styles for Sidebar
import dashboard from '/src/assets/AdminSiderbar_icons/dashboard.png'
import user from '/src/assets/AdminSiderbar_icons/user.webp'
import student from '/src/assets/AdminSiderbar_icons/student.webp'
import teacher from '/src/assets/AdminSiderbar_icons/teacher.webp'
import subject from'/src/assets/AdminSiderbar_icons/subject.png'
import branch from'/src/assets/AdminSiderbar_icons/branch.webp'
import exam from '/src/assets/AdminSiderbar_icons/exam.webp'
import useractivity from '/src/assets/AdminSiderbar_icons/UserActivity.webp'


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);  // State to toggle sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);  // Toggle sidebar visibility
  };
useEffect(() => {
  const handleOutsideClick = (event) => {
    if (!event.target.closest('.sidebar') && isOpen) {
      setIsOpen(false);  // Close the sidebar if click is outside
    }
  };

  document.addEventListener('mousedown', handleOutsideClick);

  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, [isOpen]);

  return (
    <div>
      {/* Hamburger button for mobile screens */}
      <button className="adhamburger" onClick={toggleSidebar}>
        &#9776; {/* Unicode character for hamburger icon */}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h3>Main Menu</h3>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
                <img src={dashboard} alt="Dashboard Icon" className="icon" />
                Dashboard
              </NavLink>
            </li>
            <li>
            <img src={user} alt="Student Icon" className="icon" />
              Users
              <ul>
                <li>
                  <NavLink to="/admin/students" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    <img src={student} alt="Student Icon" className="icon" />
                    Students
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/teachers" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    <img src={teacher} alt="Teacher Icon" className="icon" />
                    Teachers
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink to="/admin/subjects" className={({ isActive }) => isActive ? 'active-link' : ''}>
                <img src={subject} alt="Subject Icon" className="icon" />
                Subject
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/branches" className={({ isActive }) => isActive ? 'active-link' : ''}>
                <img src={branch} alt="Branch Icon" className="icon" />
                Branch
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/exams" className={({ isActive }) => isActive ? 'active-link' : ''}>
                <img src={exam} alt="Exam Icon" className="icon" />
                Exam
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/activity" className={({ isActive }) => isActive ? 'active-link' : ''}>
                <img src={useractivity} alt="User Activity Icon" className="icon" />
                User Activity
              </NavLink>
            </li>

            

          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;