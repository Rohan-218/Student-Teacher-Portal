// import React, { useState } from 'react';
// import './DailyAttReTable.css'; // Link to the CSS file

// const initialRecords = [
//   { sNo: 1, name: 'Aditya', enrollmentNo: '001', percentage: '80%', attendance: ['P', 'A', 'P', 'P', 'A', 'P'] },
//   { sNo: 2, name: 'Deeksha', enrollmentNo: '002', percentage: '90%', attendance: ['P', 'P', 'P', 'P', 'P', 'P'] },
//   { sNo: 3, name: 'Tanushka', enrollmentNo: '003', percentage: '100%', attendance: ['P', 'P', 'P', 'P', 'P', 'P'] },
//   { sNo: 4, name: 'Tanmay', enrollmentNo: '004', percentage: '70%', attendance: ['A', 'P', 'P', 'A', 'P', 'A'] },
//   { sNo: 5, name: 'Rohan', enrollmentNo: '005', percentage: '60%', attendance: ['P', 'A', 'A', 'P', 'A', 'P'] },
//   { sNo: 6, name: 'Surbhi', enrollmentNo: '006', percentage: '100%', attendance: ['P', 'P', 'P', 'P', 'P', 'P'] },
// ];

// const DailyAttendanceRecordTable = () => {
//   const [students, setStudents] = useState(initialRecords);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [dateColumns, setDateColumns] = useState([]);

//   const handleDateChange = () => {
//     const start = new Date(fromDate);
//     const end = new Date(toDate);
//     const tempDateColumns = [];

//     while (start <= end) {
//       tempDateColumns.push(start.toLocaleDateString());
//       start.setDate(start.getDate() + 1); // Increment the date by one
//     }

//     setDateColumns(tempDateColumns);
//   };

//   return (
//     <div className="teacher-daily-attendance-record-table">
//       <div className="teacher-topButtons">
//         {/* Combined Date Selection */}
//         <div className="teacher-date-selection">
//           <label>
//             From:
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//           </label>
//           <label>
//             To:
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//           </label>
//           <div className="teacher-Show-dates"> <button className="teacher-ShowDates" onClick={handleDateChange}>Show Dates</button></div>
//         </div >
        
         
        
       
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>S. No</th>
//             <th>Name</th>
//             <th>Enrollment No.</th>
//             <th>Percentage (%)</th>
//             {dateColumns.map((date, index) => (
//               <th key={index}>{date}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student, index) => (
//             <tr key={index}>
//               <td>{student.sNo}</td>
//               <td>{student.name}</td>
//               <td>{student.enrollmentNo}</td>
//               <td>{student.percentage}</td>
//               {student.attendance.slice(0, dateColumns.length).map((att, idx) => (
//                 <td key={idx}>{att}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DailyAttendanceRecordTable;










import React, { useState } from 'react';
import axios from 'axios'; // Import axios to make API calls
import './DailyAttReTable.css'; // Link to the CSS file

const DailyAttendanceRecordTable = ({studentsList}) => {
   const [students, setStudents] = useState(studentsList); // Set initial state to an empty array
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dateColumns, setDateColumns] = useState([]);
  const [error, setError] = useState(''); // State to hold error messages

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const handleDateChange = async () => {
    // Validate dates before making the API call
    if (!fromDate || !toDate) {
      setError('Please select both start and end dates.');
      return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const tempDateColumns = [];

    // Generate date columns for the selected date range
    while (start <= end) {
      tempDateColumns.push(start.toLocaleDateString());
      start.setDate(start.getDate() + 1); // Increment the date by one
    }

    setDateColumns(tempDateColumns); // Update date columns
    setError(''); // Clear any previous error message

    // Make API call to fetch attendance data
    try {
      const response = await axios.get(`http://localhost:3000/api/teachers/attendance/range`, {
        params: { fromDate: fromDate, toDate: toDate }, // Send the date range as query params
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the request headers
          'Content-Type': 'application/json'
        }
      });

      // Update the students state with the fetched data
      setStudents(response.data); // Assuming the response contains an array of student records
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data. Please try again later.'); // Set error message
    }
  };

  return (
    <div className="teacher-daily-attendance-record-table">
      <div className="teacher-topButtons">
        {/* Combined Date Selection */}
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
            <button className="teacher-ShowDates" onClick={handleDateChange}>Show Dates</button>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
      </div>

      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Enrollment No.</th>
            <th>Percentage (%)</th>
            {dateColumns.map((date, index) => (
              <th key={index}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Display index + 1 as S.No */}
                <td>{student.name}</td>
                <td>{student.enrollmentNo}</td>
                <td>{student.percentage}</td>
                {/* Check if attendance exists and is an array before using slice */}
                {Array.isArray(student.attendance) && student.attendance.length > 0
                  ? student.attendance.slice(0, dateColumns.length).map((att, idx) => (
                    <td key={idx}>{att}</td>
                  ))
                  : dateColumns.map((_, idx) => <td key={idx}>N/A</td>) // Fallback for undefined attendance
                }
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
