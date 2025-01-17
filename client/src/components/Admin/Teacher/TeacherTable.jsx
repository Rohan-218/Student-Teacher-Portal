import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';


const TeacherTable = ({ teachers, setTeachers }) => {
  const toggleTeacherStatus = async (user_id, currentStatus, index) => {
    const updatedTeachers = [...teachers];
    const newIsActiveStatus = !currentStatus; // Toggle active status

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/teachers/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,  // Ensure user_id is passed correctly
          is_active: newIsActiveStatus,  // Toggle is_active status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update teacher's status");
      }

      // Update the local teachers state with the new is_active status
      updatedTeachers[index].is_active = newIsActiveStatus;
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error("Error updating teacher's status:", error);
    }
  };

  return (
    <div className="teacher-table">
      <table>
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Name</th>
            <th>Email</th>
            <th className="hide">User ID</th>
            <th>View</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => {
            const isDeleted = !teacher.is_active; // Row is 'deleted' if is_active is false

            return (
              <tr key={teacher.user_id || index} className={isDeleted ? 'row-deleted' : ''}>
                <td>{index + 1}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td className="hide">{teacher.user_id}</td>
                <td>
                  <Link to={`/admin/teacher-profile/${teacher.user_id}`}>
                    <button 
                      className="view-btn" 
                      disabled={isDeleted} 
                      style={{ backgroundColor: isDeleted ? 'grey' : 'rgb(20 97 125)', cursor: isDeleted ? 'not-allowed' : 'pointer' }}
                    >
                      View
                    </button>
                  </Link>
                </td>
                <td>
                  <button 
                    className={`delete-btn ${isDeleted ? 'add-btn' : ''}`} 
                    onClick={() => toggleTeacherStatus(teacher.user_id, teacher.is_active, index)}  // Pass is_active state correctly
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {isDeleted ? <FontAwesomeIcon icon={faCheck} style={{ color: 'black', fontSize: '16px' }}/>  : <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red', fontSize: '16px' }} />}
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

export default TeacherTable;
