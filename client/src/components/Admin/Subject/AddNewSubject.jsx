import React, { useEffect, useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import './AddNewSubject.css';

const AddNewSubject = () => {
  const [formData, setFormData] = useState({
    subjectname: '',
    subjectcode: '',
    abbsubname: '',
    branch: '',
    semester: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      subjectName: formData.subjectname,
      subjectCode: formData.subjectcode,
      subjectInitials: formData.abbsubname,
      branchName: formData.branch,
      semester: formData.semester
    };
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/subjects/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        throw new Error('Failed to create subject');
      }
  
      const data = await res.json();
  
      // Show success message in an alert box
      alert(data.message);
  
      // Optionally, reset form data after success
      setFormData({
        subjectname: '',
        subjectcode: '',
        abbsubname: '',
        branch: '',
        semester: '',
      });
  
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('An error occurred while creating the subject.');
    }
  };
  

  const handleCancel = () => {
    // Reset form or redirect
    setFormData({
      subjectname: '',
      subjectcode: '',
      abbsubname: '',
      branch: '',
      semester: '',
    });
  };

  const [branches, setBranches] = useState([]);
  const [teachers, setTeachers] = useState([]);  // State for teachers

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/admin/branches', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          const activeBranches = data
            .filter(branch => branch.is_active)
            .map(branch => branch.branch_name);
          setBranches(activeBranches);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);


  return (
    <>
     <Header />
     <Sidebar />
    <div className="add-Subject-container">
      <main className="subform-container">
        <h2>Add New Subject</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject Name:</label>
            <input className="input" type="text" name="subjectname" value={formData.subjectname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Subject Code:</label>
            <input className="input" type="text" name="subjectcode" value={formData.subjectcode} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Abbreviated Subject Name:</label>
            <input className="input" type="text" name="abbsubname" value={formData.abbsubname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Branch:</label>
            <select className="select" name="branch" value={formData.branch} onChange={handleChange} required>
              <option value="">Branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Semester:</label>
            <input className="input" type="text" name="semester" value={formData.semester} onChange={handleChange}  min="1" max="8" required />
          </div>
          <div className="form-buttons">
            <button className="btn-s" type="button" onClick={handleCancel}>Clear</button>
            <button className="btn-s" type="submit">Submit</button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
};

export default AddNewSubject;
