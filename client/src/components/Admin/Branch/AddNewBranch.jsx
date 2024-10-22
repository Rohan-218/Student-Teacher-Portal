import React, { useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import { Link } from 'react-router-dom';
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
      const res = await fetch('http://192.168.1.17:3000/api/admin/branches/create', {
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
    <>
      <Header />
      <Sidebar />
    <div className="add-branch-container">  
      <main className="form-container-b">
        <h2>Add New Branch</h2>
        <Link to="/admin/branches">
        <span className='close'> &times; </span>
        </Link>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Branch Name:</label>
            <input className="input" type="text" name="Branchname" value={formData.Branchname} onChange={handleChange} required />
          </div>
          <div className="form-buttons">
            <button className="btn-b" type="button" onClick={handleCancel}>Clear</button>
            <button className="btn-b" type="submit">Submit</button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
};

export default AddNewBranch;
