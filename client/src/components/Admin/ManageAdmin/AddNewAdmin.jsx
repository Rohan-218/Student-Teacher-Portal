import React, { useState } from 'react';
import './AddNewAdmin.css';

const AddNewAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include token if needed for authentication
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Uncomment if using token for auth
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      const data = await response.json();
      console.log('Admin created successfully:', data);

      // Show alert with success message
      alert(data.message); // Show success message from API

      // Optionally reset form or redirect to another page
      handleCancel(); // Reset form after successful submission
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin: ' + error.message); // Show error message
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
    });
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
            <button className="btn-new" type="submit">Submit</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddNewAdmin;
