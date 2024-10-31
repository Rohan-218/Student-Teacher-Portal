import React, { useEffect, useState } from 'react';
import TeacherProfile from '../TeacherProfile.jsx';
import './TeacherDashboard.css';
import Sidebar from '../TeacherSidebar/Sidebar.jsx';
import TeacherScoreboard from '../TeacherScoreboard/TeacherScoreboard.jsx';
import TeacherAttendance from '../TeacherAttendance/TeacherAttendance.jsx';
import StudentRecord from '../StudentRecord/StudentRecord.jsx';

function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      fetch('https://student-teacher-portal-server.onrender.com/api/teachers/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse response as JSON
        })
        .then(data => {
          setTeacherData(data); // Update state with fetched data
        })
        .catch(error => {
          console.error('Error fetching teacher profile data', error);
        });
    }
  }, []);

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="teacher-dashboard">
      <Sidebar handleScrollToSection={handleScrollToSection} />  
      <div className="container-section">
          <h2 className="sh" id='teacher-dashboard'>Dashboard</h2>
        <div className="teacher-profile-section">
          {teacherData ? (
            <TeacherProfile data={teacherData} />
          ) : (
            <p>Loading teacher profile...</p>
          )}
        </div>
          <h2 className="sh" id='teacher-scoreboard'>Scoreboard</h2>
        <div className='teacher-table-container'>
          <TeacherScoreboard />
        </div>
          <h2 className="sh" id='teacher-attendance'>Attendance</h2>
        <div className='teacher-table-container'>
          <TeacherAttendance />
        </div>
          <h2 className="sh" id='teacher-student-record'>Student Record</h2>
         <div className='teacher-table-container'>
          <StudentRecord />
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;