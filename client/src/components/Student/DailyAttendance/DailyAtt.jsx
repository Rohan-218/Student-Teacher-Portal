import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './DailyAtt.css';

const DailyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [currentPage, setCurrentPage] = useState({}); // Store current page for each subject
  const recordsPerPage = 5;

  // Fetch student data from the API
  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/students/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Fetch attendance data from the API
  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/students/attendance-daily-record', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchAttendanceData();
  }, []);

  // Group attendance data by subject for rendering
  const groupedData = attendanceData.reduce((acc, record) => {
    const { subject_code, subject_name, attendance_record_id, date, total_lectures, percentage, status } = record;

    if (!subject_code) return acc;

    // Initialize subject data if not already present
    if (!acc[subject_code]) {
      acc[subject_code] = {
        subject_name,
        records: []
      };
    }

    // Push the current record into the subject's records array
    acc[subject_code].records.push({
      attendance_record_id,
      date,
      total_lectures,
      percentage,
      status
    });

    return acc;
  }, {});

  // Prepare attendance entries for rendering
  const attendanceEntries = Object.values(groupedData);

  // Sort records within each subject by date in descending order
  attendanceEntries.forEach(entry => {
    entry.records.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  });

  // Handle page change for specific subject
  const handlePageChange = (subjectCode, direction) => {
    setCurrentPage(prevState => ({
      ...prevState,
      [subjectCode]: Math.max(1, (prevState[subjectCode] || 1) + direction)
    }));
  };

  return (
    <div className="Daily">
      <h1>Daily Attendance Record</h1>

      {/* Attendance details section */}
      <div className="Attendance-Details">
        {studentData && (
          <>
            <span>Name: {studentData.student_name}</span>
            <span>Enrollment No.: {studentData.enrollment_no}</span>
          </>
        )}
      </div>

      {/* Attendance data */}
      <div className='student-attendance-container'>
        {attendanceEntries.length === 0 ? (
          <div>No attendance data available.</div>
        ) : (
          attendanceEntries.map((entry, index) => {
            const totalPages = Math.ceil(entry.records.length / recordsPerPage);
            const currentSubjectPage = currentPage[entry.subject_code] || 1;
            const indexOfLastRecord = currentSubjectPage * recordsPerPage;
            const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
            const currentRecords = entry.records.slice(indexOfFirstRecord, indexOfLastRecord);

            return (
              <div key={index}>
                <div className="Sub1">
                  <span>Subject: {entry.subject_name}</span>
                </div>

                {/* Attendance table for each subject */}
                <table className="Attendance-Table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total lectures </th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((record, recordIndex) => (
                        <tr key={recordIndex}>
                          <td>{record.date || 'N/A'}</td>
                          <td>{record.total_lectures !== null ? record.total_lectures : 'N/A'}</td>
                          <td>{record.status || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No records available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="Pagination-Controls">
                  <button
                    onClick={() => handlePageChange(entry.subject_code, -1)}
                    disabled={currentSubjectPage === 1}
                  >
                    &laquo;
                  </button>
                  <span> {currentSubjectPage} of {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(entry.subject_code, 1)}
                    disabled={currentSubjectPage === totalPages}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Back button */}
      <div className="Backbtn">
        <Link to="/Student-dashboard">
          <button className="Back-button1">←</button>
        </Link>
      </div>
    </div>
  );
};

export default DailyAttendance;
