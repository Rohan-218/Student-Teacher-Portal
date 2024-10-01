import React, { useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import './AddNewBranch.css';

const AddNewBranch = () => {
  const [formData, setFormData] = useState({
    Branchname: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      branchName: formData.Branchname
    };
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/branches/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        throw new Error('Failed to create branch');
      }
  
      const data = await res.json();
  
      // Show success message in an alert box
      alert("Successfully branch created.");
  
      // Optionally, reset form data after success
      setFormData({
        Branchname: '',
      });
  
    } catch (error) {
      console.error('Error creating branch:', error);
      alert('An error occurred while creating the branch.');
    }
  };
  

  const handleCancel = () => {
    // Reset form or redirect
    setFormData({
        Branchname: '',
    });
  };

  return (
    <div className="add-branch-container">
         <Header />
         <Sidebar />
      <main className="form-container">
        <h2>Add New Branch</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Branch Name:</label>
            <input className="input" type="text" name="Branchname" value={formData.Branchname} onChange={handleChange} required />
          </div>
          <div className="form-buttons">
            <button className="btn" type="button" onClick={handleCancel}>Cancel</button>
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddNewBranch;
