// src/components/Student/StudentSidebar/StudentSidebar.jsx
import React, { useState, useEffect } from 'react';
import './StudentSidebar.css';

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
        <div className={`hamburger ${isOpen ? 'hide' : ''}`} onClick={toggleSidebar}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>
      )}
      {(isOpen || !isMobile) && (
        <div className={`Sidebar ${isMobile && !isOpen ? 'collapsed' : ''}`}>
          <button onClick={() => { onScroll('dashboard'); setIsOpen(isMobile ? false : true); }}>Dashboard</button>
          <button onClick={() => { onScroll('scoreboard'); setIsOpen(isMobile ? false : true); }}>Scoreboard</button>
          <button onClick={() => { onScroll('attendance'); setIsOpen(isMobile ? false : true); }}>Attendance</button>
        </div>
      )}
    </div>
  );
};

export default StudentSidebar;
