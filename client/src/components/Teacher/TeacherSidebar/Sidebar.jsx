import React from 'react';
import './Sidebar.css';
import dashboard from '/src/assets/TeacherSidebar_icon/dashboard1.png'
import scoreboard from  '/src/assets/TeacherSidebar_icon/marks.png' 
import attendance from  '/src/assets/TeacherSidebar_icon/attendance.png'
import studentrecoard from  '/src/assets/TeacherSidebar_icon/recode.png'



const Sidebar = ({ handleScrollToSection }) => {
  return (
    <div className="teacher-sidebar">
      <button onClick={() => handleScrollToSection('teacher-dashboard')}>
        <img src={dashboard} alt="Dashboard Icon" className="icon" />
        Dashboard
      </button>
      <button onClick={() => handleScrollToSection('teacher-scoreboard')}>
        <img src={scoreboard} alt="Scoreboard Icon" className="icon" />
        Scoreboard
      </button>
      <button onClick={() => handleScrollToSection('teacher-attendance')}>
        <img src={attendance} alt="Attendance Icon" className="icon" />
        Attendance
      </button>
      <button onClick={() => handleScrollToSection('teacher-student-record')}>
        <img src={studentrecoard} alt="Student Record Icon" className="icon" />
        Student Record
      </button>
    </div>
  );
};

export default Sidebar;
