import React, { useState } from 'react';
import './Table.css'; // Link to the CSS file

const StudentTable = ({ students = [], setStudents, onSave }) => {
  // Function to handle input change for marks
  const handleInputChange = (index, value) => {
    // Ensure the input is a valid number or empty
    if (value === '' || /^\d+$/.test(value)) {
      const updatedStudents = [...students];
      updatedStudents[index].Marks_Obtained = value;
      setStudents(updatedStudents); // Update the students prop with the new marks
    }
  };

  // Function to handle Enter key press and move to the next input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      // Prevent default form submission behavior
      e.preventDefault();

      // Focus on the next input field if available
      const nextInput = document.querySelector(`#marks-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className="teacher-student-table">
      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Enrollment No.</th>
            <th>Marks Obtained</th>
            <th>Percent(%)</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.student_name || 'N/A'}</td>
                <td>{student.enrollment_no || 'N/A'}</td>
                <td>
                  <input
                    id={`marks-input-${index}`} // Unique ID for each input
                    type="text"
                    value={student.Marks_Obtained || ''} // Ensure the field is controlled
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)} // Handle Enter key press
                    placeholder="Enter marks"
                    style={{ width: '60px', textAlign: 'center' }} // Styling for the input box
                  />
                </td>
                <td>{student.percentage || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="teacher-marks-bottom-buttons">
        {/* Use the onSave prop for saving marks */}
        <button className="teacher-marks-save-btn" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default StudentTable;

