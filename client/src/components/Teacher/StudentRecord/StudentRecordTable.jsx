import './StudentRecordTable.css'; 

const StudentRecordTable = ({ students, examColumns }) => {
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
            {examColumns.map((exam, index) => (
              <th key={index}>{exam.replace('_', ' ')}</th> // Display dynamic exam columns
            ))}
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
                <td>{Math.round(student.attendance_percentage * 100) / 100}</td>
                {examColumns.map((exam, examIndex) => (
                  <td key={examIndex}>{student[exam]}</td> 
                ))}
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
