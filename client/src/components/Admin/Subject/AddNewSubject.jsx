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
    semester: '',
    teacher: '',
    contactNo: ''  // Ensure to add this if it's included in your form
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., API call)
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    // Reset form or redirect
    setFormData({
      subjectname: '',
      subjectcode: '',
      abbsubname: '',
      branch: '',
      semester: '',
      teacher: '',
      contactNo: '',
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

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/admin/teachers', {
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

        // Only extract teacher names
        if (Array.isArray(data)) {
          const teacherNames = data.map(teacher => teacher.teacher_name);
          setTeachers(teacherNames);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="add-Subject-container">
      <Header />
      <Sidebar />
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
          <div className="form-group">
            <label>Teacher:</label>
            <select className="select" name="teacher" value={formData.teacher} onChange={handleChange} required>
              <option value="">Select Teacher</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Contact No:</label>
            <input className="input" type="tel" name="contactNo" maxLength="10" value={formData.contactNo} onChange={handleChange} required />
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

export default AddNewSubject;
