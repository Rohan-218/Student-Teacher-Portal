import React from 'react';
import './Sidebar.css';
import dashboard from '/src/assets/TeacherSidebar_icon/dashboard.png'
import scoreboard from  '/src/assets/TeacherSidebar_icon/exam.png' 
import attendance from  '/src/assets/TeacherSidebar_icon/checking-attendance.png'
import studentrecoard from  '/src/assets/TeacherSidebar_icon/srecode.png'



const Sidebar = ({ handleScrollToSection }) => {
  return (
    <div className="Sidebar">
      <button onClick={() => handleScrollToSection('teacher-dashboard')}>
        <img src={dashboard} alt="Dashboard Icon" className="icons" />
        Dashboard
      </button>
      <button onClick={() => handleScrollToSection('teacher-scoreboard')}>
        <img src={scoreboard} alt="Scoreboard Icon" className="icons" />
        Scoreboard
      </button>
      <button onClick={() => handleScrollToSection('teacher-attendance')}>
        <img src={attendance} alt="Attendance Icon" className="icons" />
        Attendance
      </button>
      <button onClick={() => handleScrollToSection('teacher-student-record')}>
        <img src={studentrecoard} alt="Student Record Icon" className="icons" />
        Student Record
      </button>
    </div>
  );
};

export default Sidebar;
