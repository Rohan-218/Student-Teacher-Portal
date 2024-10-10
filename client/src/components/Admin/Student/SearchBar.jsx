import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { Link } from 'react-router-dom'; // Import the styles for the search bar

const SearchBar = ({ onSearch, fetchInitialStudents }) => {
  const [branches, setBranches] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

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

  const handleSearch = async () => {
    if (searchName.trim() === '') {
      fetchInitialStudents(); // Fetch initial students if no search name
      return;
    }

    // Search logic for names
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/admin/students/search?name=${searchName}`, {
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
      const formattedData = data.map(student => ({
        name: student.student_name,
        enrollmentNumber: student.enrollment_no,
        email: student.email,
        password: student.decrypted_password,
        userId: student.user_id,
        is_active: student.is_active
      }));

      onSearch(formattedData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    fetchStudentsByBranchAndSemester(e.target.value, selectedSemester);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    fetchStudentsByBranchAndSemester(selectedBranch, e.target.value);
  };

  const fetchStudentsByBranchAndSemester = async (branch, semester) => {
    if (branch && semester) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/admin/students/branch-semester?branch_name=${branch}&semester=${semester}`, {
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
        const formattedData = data.map(student => ({
          name: student.student_name,
          enrollmentNumber: student.enrollment_no,
          email: student.email,
          password: student.decrypted_password,
          userId: student.user_id,
          is_active: student.is_active
        }));

        onSearch(formattedData); // Pass the new student list to the parent
      } catch (error) {
        console.error('Error fetching students by branch and semester:', error);
      }
    } else {
      fetchInitialStudents(); // If either value is missing, fetch all students
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input 
          type="text" 
          placeholder="Search " 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)} 
        />
        <button className="stu-sea"onClick={handleSearch}>Search</button>
        <Link to="/admin/add-student">
          <button className="add-student-btn">Add New Student</button>
        </Link>
      </div>

      <div className="filter-options">
        <select className="bra" value={selectedBranch} onChange={handleBranchChange}>
          <option value="">Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        
        <select className="sem" value={selectedSemester} onChange={handleSemesterChange}>
          <option value="">Semester</option>
          {[...Array(8).keys()].map(sem => (
            <option key={sem + 1} value={sem + 1}>{sem + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
