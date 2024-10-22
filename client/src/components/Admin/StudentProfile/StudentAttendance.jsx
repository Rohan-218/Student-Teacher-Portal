import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './StudentAttendance.css';
import Header from '../../../common/Admin/Header';


const COLORS = ['#CD84A3', '#CBDEE6'];

const StudentAttendance = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAccordions, setActiveAccordions] = useState([]);

  
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const response = await fetch(`http://localhost:3000/api/admin/students/attendance/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
            'Content-Type': 'application/json', // Set content type to JSON
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [userId]);

  const toggleAccordion = (index) => {
    if (activeAccordions.includes(index)) {
      setActiveAccordions(activeAccordions.filter((i) => i !== index));
    } else {
      setActiveAccordions([...activeAccordions, index]);
    }
  };

  const getPieChartData = (attendedClasses, totalClasses) => [
    { name: 'Attended', value: attendedClasses },
    { name: 'Missed', value: totalClasses - attendedClasses },
  ];

  const calculateAttendancePercentage = (attended, total) =>
    total > 0 ? ((attended / total) * 100).toFixed(0) : '0';

  const barChartData = attendanceData.map((item) => ({
    subjectName: item.subject_name,
    attendancePercentage: calculateAttendancePercentage(item.attended_lecture, item.total_lectures),
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='st-atten'>
      <Header />
      <div className="stattendance-container">
        <div className="stattendance-header">
          <Link to={`/admin/student-profile/${userId}`}>
            <button className="back-button">←</button>
          </Link>
          <h1 className="stattendance-title">ATTENDANCE</h1>
        </div>

        {/* Accordions */}
        {attendanceData.map((item, index) => (
          <div key={index} className={`stattendance-accordion ${activeAccordions.includes(index) ? 'open' : ''}`}>
            <div className="stattendance-accordion-header" onClick={() => toggleAccordion(index)}>
              <p>{item.subject_name} ({item.subject_code})</p>
              <span className="stattendance-accordion-arrow">{activeAccordions.includes(index) ? '⌃' : '⌄'}</span>
            </div>
            {activeAccordions.includes(index) && (
              <div className="stattendance-accordion-content">
                <div className="stattendance-details">
                  <p><strong>Subject Code:</strong> {item.subject_code}</p>
                  <p><strong>Subject Name:</strong> {item.subject_name}</p>
                  <p><strong>Total Classes:</strong> {item.total_lectures}</p>
                  <p><strong>Classes Attended:</strong> {item.attended_lecture}</p>
                  <p><strong>Updated Till:</strong> {item.updated_at || 'Not updated'}</p>
                </div>
                <div className="stattendance-chart">
                  <PieChart width={120} height={120}>
                    <Pie
                      data={getPieChartData(item.attended_lecture, item.total_lectures)}
                      dataKey="value"
                      outerRadius={40}
                      fill="#8884d8"
                    >
                      {getPieChartData(item.attended_lecture, item.total_lectures).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="stattendance-percentage">
                    <p>{calculateAttendancePercentage(item.attended_lecture, item.total_lectures)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Bar chart for attendance percentage comparison */}
        <div className="stattendance-bar-chart">
          <h3>All Subjects Attendance Percentage:</h3>
          <BarChart width={500} height={300} data={barChartData}>
            <XAxis dataKey="subjectName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attendancePercentage" fill="#9bbace" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
