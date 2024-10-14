import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceTable.css';

const AttendanceTable = ({ students = [], attendanceList = [], onSave, isUpdating, onToggleAttendance }) => {
  const buttonRefs = useRef([]);
  const navigate = useNavigate();

  // Handle attendance toggle for Present/Absent
  const toggleAttendance = (enrollmentNo) => {
    onToggleAttendance(enrollmentNo); // Toggle status in the parent state
  };

  return (
    <div className="teacher-attendance-table">
      <h3>Mark Attendance</h3>
      <div className='att-table'>
      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Enrollment No.</th>
            <th>Attendance Status</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => {
              const attendanceRecord = attendanceList.find(
                (att) => att.enrollment_no === student.enrollment_no
              ) || {};
              const status = attendanceRecord.status || student.status || 'MARK'; // Default to Absent

              return (
                <tr key={student.enrollment_no}>
                  <td>{index + 1}</td>
                  <td>{student.student_name || 'N/A'}</td>
                  <td>{student.enrollment_no || 'N/A'}</td>
                  <td>
                    <button
                      className={`teacher-attendance-button ${status.toLowerCase()}`} // Class based on status
                      tabIndex="0"
                      ref={(el) => (buttonRefs.current[index] = el)}
                      onClick={() => toggleAttendance(student.enrollment_no)} // Toggle attendance on click
                    >
                      {status} {/* Show current status */}
                    </button>
                  </td>
                  <td>{student.percentage || 'N/A'}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No students available</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      <div className="teacher-bottom-buttons">
        <button className="teacher-daily-record-btn" onClick={() => navigate('/daily-attendance-record')}>
          Daily Attendance Record
        </button>

        <button className="teacher-save-btn" onClick={onSave}>
          {isUpdating ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
