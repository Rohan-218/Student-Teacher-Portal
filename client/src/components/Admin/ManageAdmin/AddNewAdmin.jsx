import React, { useState } from 'react';
import './AddNewAdmin.css';

const AddNewAdmin = ({ onClose ,refreshTable  }) => {  // Receive onClose prop
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable submit button once the API call starts

    try {
      const response = await fetch('http://student-teacher-portal-server.onrender.com/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      const data = await response.json();
      alert(data.message);  // Show success message
      handleCancel();       // Reset the form
      // Refresh the exam table
      refreshTable();
      onClose();            // Close the popup after successful submission
    } catch (error) {
      alert('Error creating admin: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    setLoading(false);
  };

  return (
    <div className="add-newadmin-container">
      <main className="new-form-container">
        <h2>Add New Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Name:</label>
            <input
              className="input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button className="btn-new" type="button" onClick={handleCancel}>Clear</button>
            <button className="btn-new" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}  {/* Disable and change text during loading */}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddNewAdmin;
