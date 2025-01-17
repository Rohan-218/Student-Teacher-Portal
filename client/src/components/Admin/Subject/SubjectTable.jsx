import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

// import './SubjectTable.css';
const SubjectTable = ({ subjects, setSubjects }) => {
  const handleDelete = async (index) => {
    const token = localStorage.getItem('token');
    const subject = subjects[index];
    const updatedSubjects = [...subjects];
    const newStatus = !subject.is_active;  // Toggle the is_active status

    try {
      const res = await fetch(`http://localhost:3000/api/admin/subjects/update`, {
        method: 'PUT', // Assuming it's a PUT request
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject_id: subject.subject_id,
          is_active: newStatus
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update subject status');
      }

      // If API call is successful, update local state
      updatedSubjects[index].is_active = newStatus;
      setSubjects(updatedSubjects);  // Update the state in the parent component

    } catch (error) {
      console.error("Error updating subject status:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="subject-table">
      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Subject Name</th>
            <th>Subject Code</th>
            <th>Abb. Subject Name</th>
            <th>Branch</th>
            <th>Semester</th>
            <th>Teacher</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index} className={subject.is_active ? '' : 'deleted'}>
              <td>{index + 1}</td>
              <td>{subject.subject_name}</td>
              <td>{subject.subject_code}</td>
              <td>{subject.sub_initials}</td>
              <td>{subject.branches}</td>
              <td>{subject.semester}</td>
              <td>{subject.teachers}</td>
              <td>
                <button
                  className={`delete-btn ${!subject.is_active ? 'add-btn' : ''}`}
                  onClick={() => handleDelete(index)}
                  style={{ backgroundColor: 'transparent' }}
                >
                  {subject.is_active ?<FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red', fontSize: '16px' }} /> :<FontAwesomeIcon icon={faCheck} style={{ color: 'black', fontSize: '16px' }}/> }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectTable;
