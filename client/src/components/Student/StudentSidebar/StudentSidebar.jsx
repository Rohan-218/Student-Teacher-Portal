// src/components/Student/StudentSidebar/StudentSidebar.jsx
import React, { useState, useEffect } from 'react';
// import './StudentSidebar.css';
import dashboard from '/src/assets/TeacherSidebar_icon/dashboard1.png'
import scoreboad from '/src/assets/TeacherSidebar_icon/marks.png'
import attendace from '/src/assets/TeacherSidebar_icon/attendance.png'

const StudentSidebar = ({ onScroll }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth > 768) {
      setIsOpen(true); // Ensure sidebar is open on desktop
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {isMobile && (
        <div className={`Hamburger1 ${isOpen ? 'hide' : ''}`} onClick={toggleSidebar}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>
      )}
      {(isOpen || !isMobile) && (
        <div className={`Sidebar ${isMobile && !isOpen ? 'collapsed' : ''}`}>
         <button onClick={() => onScroll('dashboard')}>
        <img src={dashboard} alt="Dashboard Icon" className="icon" />
        Dashboard
      </button>
      <button onClick={() => onScroll('scoreboard')}>
        <img src={scoreboad} alt="Scoreboard Icon" className="icon" />
        Scoreboard
      </button>
      <button onClick={() => onScroll('attendance')}>
        <img src={attendace} alt="Attendance Icon" className="icon" />
        Attendance
      </button>
        </div>
      )}
    </div>
  );
};

export default StudentSidebar;
