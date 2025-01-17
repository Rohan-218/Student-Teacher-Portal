import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';


const ExamTable = ({ refresh }) => {
  const [exams, setExams] = useState([]);

  // Fetch exams from the API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/admin/exams', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Include token in headers
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }

        const data = await response.json();
        const formattedExams = data.map((exam, index) => ({
          sNo: index + 1,
          exam_id: exam.exam_id,   // Include exam_id for API requests
          examname: exam.exam_name,
          maxmarks: exam.maximum_marks,
          is_active: exam.is_active   // Track active/inactive status
        }));

        setExams(formattedExams);  // Update state with fetched exams
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, [refresh]);

  // Handle delete toggle (API call for deleting/restoring)
  const handleDelete = async (index) => {
    const updatedExams = [...exams];
    const exam = updatedExams[index];
    const newStatus = !exam.is_active;  // Toggle active/inactive status
    const isActiveString = newStatus ? "true" : "false";  // Convert to string for the request

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/exams/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include token in headers
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam_id: exam.exam_id.toString(),  // Ensure exam_id is a string
          is_active: isActiveString          // Ensure is_active is sent as a string
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update exam status');
      }

      // If successful, update the local state
      updatedExams[index].is_active = newStatus;
      setExams(updatedExams);

    } catch (error) {
      console.error('Error updating exam status:', error);
    }
  };

  return (
    <div className="exam-table">
      <table>
        <thead>
          <tr>
            <th>S. no</th>
            <th>Exam Name</th>
            <th>Max Marks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr key={index} className={!exam.is_active ? 'deleted' : ''}>
              <td>{exam.sNo}</td>
              <td>{exam.examname}</td>
              <td>{exam.maxmarks}</td>
              <td>
                <button 
                  className={`delete-btn ${!exam.is_active ? 'add-btn' : ''}`}
                  onClick={() => handleDelete(index)}
                  style={{ backgroundColor: 'transparent' }}
                >
                  {!exam.is_active ? <FontAwesomeIcon icon={faCheck} style={{ color: 'black', fontSize: '16px' }}/>  : <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red', fontSize: '16px' }} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamTable;
