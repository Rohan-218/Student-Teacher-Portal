import  { useState } from 'react';
import './StudentRecordTable.css'; // Link to the CSS file


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
            <th>Finals</th>
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
              <td>{student.finals_marks}</td>
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
