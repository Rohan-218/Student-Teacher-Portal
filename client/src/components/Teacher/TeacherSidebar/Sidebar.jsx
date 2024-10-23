import React from 'react';
import '../../common/Sidebar.css';
import dashboard from '/src/assets/TeacherSidebar_icon/dashboard.png'
import scoreboard from  '/src/assets/TeacherSidebar_icon/exam.png' 
import attendance from  '/src/assets/TeacherSidebar_icon/checking-attendance.png'
import studentrecoard from  '/src/assets/TeacherSidebar_icon/cabinet.png'



const Sidebar = ({ handleScrollToSection }) => {
  return (
    <div className="Sidebar">
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
