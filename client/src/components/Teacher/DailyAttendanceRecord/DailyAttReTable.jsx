import React, { useState } from 'react';
import axios from 'axios';
import './DailyAttReTable.css';

const DailyAttendanceRecordTable = ({ subjectID }) => {
  const [students, setStudents] = useState([]); // Initialize with an empty array
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dateColumns, setDateColumns] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token'); // Get token from localStorage

  // Function to fetch attendance based on date range and subject
  const handleDateChange = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      // API call to get attendance records
      const response = await axios.get(`http://localhost:3000/api/teachers/attendance/range`, {
        params: { fromDate, toDate, subjectID },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Process attendance data from API response
      const fetchedStudents = response.data; // Directly use the response data as it already contains student attendance records

      // Create a mapping of students to their attendance records
      const studentMap = {};
      const fetchedDateColumns = new Set(); // Use a Set to avoid duplicates

      fetchedStudents.forEach(student => {
        const { student_name, enrollment_no, date, attendance, percentage } = student;
        const formattedDate = date.split('T')[0]; // Extract just the date part

        // Add date to the Set of date columns
        fetchedDateColumns.add(formattedDate);

        // Create student entry if it doesn't exist
        if (!studentMap[enrollment_no]) {
          studentMap[enrollment_no] = {
            student_name,
            enrollment_no,
            percentage,
            attendance_records: {}, // Initialize as an object to hold arrays of attendance
          };
        }

        // Initialize the attendance array if it doesn't exist for this date
        if (!studentMap[enrollment_no].attendance_records[formattedDate]) {
          studentMap[enrollment_no].attendance_records[formattedDate] = []; // Create an array for this date
        }

        // Add the attendance record to the array
        studentMap[enrollment_no].attendance_records[formattedDate].push(attendance); 
      });

      setStudents(Object.values(studentMap)); // Convert the student map back to an array
      setDateColumns(Array.from(fetchedDateColumns)); // Convert Set to Array for date columns
      setError(''); // Clear error message
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data. Please try again later.');
    }
  };

  return (
    <div className="teacher-daily-attendance-record-table">
      <div className="teacher-topButtons">
        {/* Date selection inputs */}
        <div className="teacher-date-selection">
          <label>
            From:
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label>
            To:
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
          <div className="teacher-Show-dates">
            <button className="teacher-ShowDates" onClick={handleDateChange}>
              Show Dates
            </button>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
      </div>

      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Enrollment No.</th>
            <th>Percentage (%)</th>
            {dateColumns.map((date, index) => (
              <th key={index}>{date}</th> // Display dynamic date columns
            ))}
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Display index as S.No */}
                <td>{student.student_name}</td> {/* Student name from fetched data */}
                <td>{student.enrollment_no}</td> {/* Enrollment number */}
                <td>{student.percentage || 'N/A'}</td> {/* Show percentage if available */}

                {/* Attendance data for each date */}
                {dateColumns.map((date, idx) => {
                  const attendanceRecords = student.attendance_records[date]; // Get attendance records for the date
                  return (
                    <td key={idx}>
                      {attendanceRecords ? (
                        attendanceRecords.map((att, recordIdx) => (
                          <div key={recordIdx}>
                            {att === 'P' ? 'Present' : att === 'A' ? 'Absent' : 'No Lecture'}
                          </div>
                        ))
                      ) : (
                        'N/A' // Show 'N/A' if no attendance record for that date
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4 + dateColumns.length}>No students found for the selected date range.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DailyAttendanceRecordTable;
