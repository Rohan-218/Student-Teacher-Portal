import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import SearchBar from './SearchBar'; 
import StudentTable from './StudentTable'; 
import './StudentList.css';  // Import specific styles for StudentList

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchInitialStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/students', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        // Token is unauthorized or blacklisted, redirect to admin login
        navigate('/admin/admin-login');
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const formattedData = data.map(student => ({
        name: student.student_name,
        enrollmentNumber: student.enrollment_no,
        email: student.email,
        userId: student.user_id,
        is_active: student.is_active // Include is_active status
      }));

      setStudents(formattedData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchInitialStudents(); // Fetch students on mount
  }, []);

  const handleSearch = (searchResults) => {
    setStudents(searchResults); // Update students state with search results
  };

  return (
    <div className="student-list">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="container">
        <span>Students</span>
          <SearchBar onSearch={handleSearch} fetchInitialStudents={fetchInitialStudents} />
          <StudentTable students={students} setStudents={setStudents} />
        </div>
      </div>
    </div>
  );
};

export default StudentList;
