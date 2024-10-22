import React, { useState } from 'react';
import './AddNewExam.css';

const AddNewExam = ({ closePopup, refreshTable  }) => {
  const [formData, setFormData] = useState({
    Examname: '',
    MaxMarks: '',
  });
  const [loading, setLoading] = useState(false);  // New loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable submit button once the API call starts
  
    const payload = {
      examName: formData.Examname,
      maximumMarks: formData.MaxMarks,
    };
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.1.17:3000/api/admin/exams/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        throw new Error('Failed to create exam'); // Throw error if the response is not ok
      }
  
      const data = await res.json();
  
      // Show success message in an alert box
      alert('Successfully created exam.');
  
      // Reset form data after success
      setFormData({
        Examname: '',
        MaxMarks: '',
      });
  
      // Refresh the exam table
      refreshTable();
  
      // Close the popup after successful submission
      closePopup();
  
    } catch (error) {
      console.error('Error creating exam:', error);
      // Show error message only if there's an actual error
      alert('An error occurred while creating the exam.');
    }
  };
  

  const handleCancel = () => {
    // Reset form or redirect
    setFormData({
      Examname: '',
      MaxMarks: '',
    });
    setLoading(false);
  };

  return (
    <div className="add-exam-container">
      <main className="form-container-e">
        <h2>Add New Exam</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Name:</label>
            <input
              className="input"
              type="text"
              name="Examname"
              value={formData.Examname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Max Marks:</label>
            <input
              className="input"
              type="number"
              name="MaxMarks"
              value={formData.MaxMarks}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button className="btn-e" type="button" onClick={handleCancel}>Clear</button>
            <button className="btn-e" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}  {/* Disable and change text during loading */}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddNewExam;
