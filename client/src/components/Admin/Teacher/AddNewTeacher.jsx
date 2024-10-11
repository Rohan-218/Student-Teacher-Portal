import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import './AddNewTeacher.css';

const AddNewTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: '',
    contactNo: '',
    subjects: [],
  });

  const [subjectOptions, setSubjectOptions] = useState([]);

  // Function to fetch subjects from the API
  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/subjects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();

      const formattedSubjects = data.map((subject) => ({
        value: subject.subject_code,
        label: `${subject.subject_name} (${subject.subject_code})`,
      }));

      setSubjectOptions(formattedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle change for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle change for subjects (using react-select)
  const handleSubjectChange = (selectedOptions) => {
    const subjects = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, subjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      designation: formData.designation,
      contactNo: formData.contactNo,
      subjects: formData.subjects,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/teachers/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create teacher');
      }

      alert('Successfully created teacher.');

      // Reset the form after successful submission
      setFormData({
        name: '',
        email: '',
        password: '',
        designation: '',
        contactNo: '',
        subjects: [],
      });
    } catch (error) {
      console.error('Error creating teacher:', error);
      alert('An error occurred while creating the teacher.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      designation: '',
      contactNo: '',
      subjects: [],
    });
  };

  return (
    <>
      <Header />
      <Sidebar />
    <div className="add-teacher-container">
     <main className="teaform-container">
        <h2>Add New Teacher</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
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
          <div className="form-group">
            <label>Designation:</label>
            <select
              className="select"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            >
              <option value="">Select Designation</option>
              <option value="HOD">HOD</option>
              <option value="Professor">Professor</option>
              <option value="Assistant Prof.">Assistant Prof.</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contact No:</label>
            <input
              className="input"
              type="tel"
              name="contactNo"
              maxLength="10"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Subjects:</label>
            <Select
              isMulti
              name="subjects"
              options={subjectOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleSubjectChange} // Changed to handleSubjectChange
              value={subjectOptions.filter((option) =>
                formData.subjects.includes(option.value)
              )}
            />
          </div>

          <div className="form-buttons">
            <button className="btn" type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
};

export default AddNewTeacher;
