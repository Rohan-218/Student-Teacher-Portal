import React from 'react';
import './StudentTable.css';
import { Link } from 'react-router-dom';

const StudentTable = ({ students, setStudents }) => {
  const toggleStudentStatus = async (user_id, currentStatus, index) => {
    const updatedStudents = [...students];
    const newIsActiveStatus = !currentStatus; // Toggle active status
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/students/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,  // Ensure user_id is passed here
          is_active: newIsActiveStatus,  // Send the toggled is_active status
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update student status');
      }
  
      // Update the local students state with the new is_active status
      updatedStudents[index].is_active = newIsActiveStatus;
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };
  
  return (
    <div class="table-container">
      <table className="student-table">
      <thead>
        <tr>
          <th>S. No.</th>
          <th>Name</th>
          <th>Enrollment No.</th>
          <th className="email">Email</th>
          <th className="hide">UserId</th>
          <th>View</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => {
          const isDeleted = !student.is_active; // Invert the condition, row is 'deleted' if is_active is false

          return (
            <tr key={index} className={isDeleted ? 'row-deleted' : ''}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.enrollmentNumber}</td>
              <td>{student.email}</td>
              <td className="hide">{student.userId}</td>
              <td>
                <Link to={`/admin/student-profile/${student.userId}`}>
                  <button 
                    className="view-btn" 
                    disabled={isDeleted} 
                    style={{ backgroundColor: isDeleted ? 'grey' : '#007bff', cursor: isDeleted ? 'not-allowed' : 'pointer' }}
                  >
                    View
                  </button>
                </Link>
              </td>
              <td>
                <button 
                  className={`delete-btn ${isDeleted ? 'add-btn' : ''}`} 
                  onClick={() => toggleStudentStatus(student.userId, student.is_active, index)} // Pass is_active state
                >
                  {isDeleted ? '✓' : '✗'}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
 </div>
  );
};

export default StudentTable;
