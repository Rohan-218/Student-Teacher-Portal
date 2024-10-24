import React from 'react';
import './Sidebar.css';
import dashboard from '/src/assets/TeacherSidebar_icon/dashboard.png'
import scoreboard from  '/src/assets/TeacherSidebar_icon/exam.png' 
import attendance from  '/src/assets/TeacherSidebar_icon/checking-attendance.png'
import studentrecoard from  '/src/assets/TeacherSidebar_icon/srecode.png'
import dash1 from '/src/assets/TeacherSidebar_icon/dashboard8.png'
import score from '/src/assets/TeacherSidebar_icon/exam3.png'
import atte from '/src/assets/TeacherSidebar_icon/attendnace2.png'



const Sidebar = ({ handleScrollToSection }) => {
  return (
    <div className="Sidebar">
      <button onClick={() => handleScrollToSection('teacher-dashboard')}>
        <img src={dashboard} alt="Dashboard Icon" className="icon12" />
        <img src={dash1} alt="Mobile Dashboard Icon" className="icon mobile-icon" />
        Dashboard
      </button>
      <button onClick={() => handleScrollToSection('teacher-scoreboard')}>
        <img src={scoreboard} alt="Scoreboard Icon" className="icon12" />
        <img src={score} alt="Mobile scoreboard Icon" className="icon mobile-icon" />
        Scoreboard
      </button>
      <button onClick={() => handleScrollToSection('teacher-attendance')}>
        <img src={attendance} alt="Attendance Icon" className="icon12" />
        <img src={atte} alt="Mobile Attendance Icon" className="icon mobile-icon" />
        Attendance
      </button>
      <button onClick={() => handleScrollToSection('teacher-student-record')}>
        <img src={studentrecoard} alt="Student Record Icon" className="icon12" />
        Student Record
      </button>
    </div>
  );
};

export default Sidebar;
