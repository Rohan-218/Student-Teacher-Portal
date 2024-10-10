import  { useState } from 'react';
import './StudentRecordTable.css'; // Link to the CSS file

// const initialRecords = [
//   { sNo: 1, name: 'Aditya', enrollmentNo: '001', classesAttended: 8, attendancePercent: '80%', midterm1: 20, midterm2: 21 },
//   { sNo: 2, name: 'Deeksha', enrollmentNo: '002', classesAttended: 9, attendancePercent: '90%', midterm1: 28, midterm2: 21 },
//   { sNo: 3, name: 'Tanushka', enrollmentNo: '003', classesAttended: 10, attendancePercent: '100%', midterm1: 22, midterm2: 25 },
//   { sNo: 4, name: 'Tanmay', enrollmentNo: '004', classesAttended: 7, attendancePercent: '70%', midterm1: 25, midterm2: 20 },
//   { sNo: 5, name: 'Rohan', enrollmentNo: '005', classesAttended: 6, attendancePercent: '60%', midterm1: 20, midterm2: 15 },
//   { sNo: 6, name: 'Surbhi', enrollmentNo: '006', classesAttended: 10, attendancePercent: '100%', midterm1: 25, midterm2: 27 },
// ];

const StudentRecordTable = ({ students }) => {

  return (
    <div className="teacher-student-record-table">
      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Enrollment No.</th>
            <th>Classes Attended</th>
            <th>Attendance %</th>
            <th>Midterm-1</th>
            <th>Midterm-2</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.student_name || 'N/A'}</td>
                <td>{student.enrollment_no || 'N/A'}</td>
              <td>{student.attended_lecture}</td>
              <td>{Math.round(student.attendance_percentage*100)/100}</td>
              <td>{student.midterm1_marks}</td>
              <td>{student.midterm2_marks}</td>
              </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No students available</td>
          </tr>
        )}
      </tbody>
      </table>
    </div>
  );
};

export default StudentRecordTable;
