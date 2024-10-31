import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import './StudentAttendance.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [openSubjects, setOpenSubjects] = useState({});
  const navigate = useNavigate();

  const toggleSubject = (code) => {
    setOpenSubjects((prevState) => ({
      ...prevState,
      [code]: !prevState[code],
    }));
  };

  // Navigate to the Daily Attendance page when the button is clicked
  const handleViewDailyAttendance = () => {
    navigate('/daily-attendance');
  };

  // Function to generate pie chart data for attendance
  const getPieChartData = (attendedLectures, totalClasses) => {
    return {
      labels: ['Classes Attended', 'Classes Missed'],
      datasets: [
        {
          data: [attendedLectures, totalClasses - attendedLectures],
          backgroundColor: ['#4d87c1', '#13385e'],
          hoverBackgroundColor: ['#acd8a7', '#f94449'],
        },
      ],
    };
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Fetch attendance data from the API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://student-teacher-portal-server.onrender.com/api/students/attendance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedSubjects = data.map((item) => ({
          code: item.subject_code,
          name: item.subject_name,
          totalClasses: item.total_lectures,
          classesAttended: item.attended_lecture,
          percentage: item.percentage,
          updatedTill: new Date(item.date).toLocaleDateString(),
        }));
        setSubjects(formattedSubjects);
      } else {
        console.error('Failed to fetch attendance data');
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <div className="Attendance-Section">
      <div className="Attendance-Header">
        <button className="daily-att-btn"onClick={handleViewDailyAttendance}>View Daily Attendance</button>
      </div>

      {subjects.map((subject) => (
        <div key={subject.code} className="Subject-Bar">
          <div className="Subject-Header" onClick={() => toggleSubject(subject.code)}>
            <span>{subject.code}</span>
            <button className="Dropdown-Button">
              {openSubjects[subject.code] ? '▲' : '▼'}
            </button>
          </div>
          {openSubjects[subject.code] && (
            <div className="Subject-Details">
              <div className="Subject-Info">
                <div className="Info-Left">
                  <p>Subject Name: {subject.name}</p>
                  <p>Total Classes: {subject.totalClasses}</p>
                  <p>Classes Attended: {subject.classesAttended}</p>
                  <p style={{ color: subject.percentage < 75 ? 'red' : 'black' }}>
                    Percentage: {subject.percentage}%
                  </p>
                  <p>Updated Till: {subject.updatedTill}</p>
                  {subject.percentage < 75 && (
                    <p className="Debarred-Message" style={{ color: 'red' }}>
                      Attendance is less than 75%.
                    </p>
                  )}
                </div>
                <div className="Info-Right">
                  <div className="Pie-Chart-Container">
                  {subject.totalClasses === 0 || subject.classesAttended === 0 ? (
                    <p>No data available.</p>
                   ) : (
                    <Pie
                      data={getPieChartData(subject.classesAttended, subject.totalClasses)}
                      options={pieChartOptions}
                    />
                   )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentAttendance;
