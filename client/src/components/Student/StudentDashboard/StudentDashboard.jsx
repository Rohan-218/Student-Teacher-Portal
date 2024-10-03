import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import StudentSidebar from '../StudentSidebar/StudentSidebar.jsx';
import StudentScoreboard from '../StudentScoreBoard/StudentScoreBoard.jsx';
import Barchart from '../StudentScoreBoard/BarChart.jsx';
import StudentAttendance from '../StudentAttendance/StudentAttendance.jsx';
import AttendanceTrendChart from '../StudentAttendance/BarChart.jsx';

const StudentDashboard = () => {
  const dashboardRef = useRef(null);
  const scoreboardRef = useRef(null);
  const attendanceRef = useRef(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const scrollToSection = (section) => {
    let ref;
    switch (section) {
      case 'dashboard':
        ref = dashboardRef;
        break;
      case 'scoreboard':
        ref = scoreboardRef;
        break;
      case 'attendance':
        ref = attendanceRef;
        break;
      default:
        return;
    }
    const yOffset = -50; // Offset to prevent hiding the heading
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      try {
        const response = await fetch('http://localhost:3000/api/students/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setStudentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="student-dashboard">
      <StudentSidebar onScroll={scrollToSection} />
      <div className="content">
        <section ref={dashboardRef} className="student-container-section">
          <h1 className='sh1'> Dashboard</h1>
          <div className="student-details">
            <div className="student-profile">
              <img src="https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg" alt="Profile" className="profile-photo" />
              <p>{studentData.student_name}</p>
            </div>
            <p><strong>Enrollment No: </strong>{studentData.enrollment_no}</p>
            <p><strong>Branch: </strong>{studentData.branch_name}</p>
            <p><strong>Semester: </strong>{studentData.semester}</p>
            <p><strong>Contact No: </strong>{studentData.contact_no}</p>
          </div>
        </section>
        <section ref={scoreboardRef} className="student-container-section">
        <h1 className='sh1'>Scoreboard</h1>
          <StudentScoreboard />
          <Barchart />
        </section>
        <section ref={attendanceRef} className="student-container-section">
        <h1 className='sh1'>Attendance</h1>
          <StudentAttendance />
          <AttendanceTrendChart />
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
