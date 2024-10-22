import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { Link } from 'react-router-dom';

const SearchBar = ({ onSearch, fetchInitialTeachers }) => {
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
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        const activeBranches = data.filter(branch => branch.is_active).map(branch => branch.branch_name);
        setBranches(activeBranches);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleSearch = async () => {
    if (searchName.trim() === '') {
      fetchInitialTeachers(); // Fetch all teachers if search is empty
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/admin/teachers/search?name=${searchName}`, {
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
      const formattedData = data.map(teacher => ({
        name: teacher.teacher_name,
        email: teacher.email,
        password: teacher.decrypted_password,
        user_id: teacher.user_id,
        is_active: teacher.is_active
      }));

      onSearch(formattedData);
    } catch (error) {
      console.error('Error fetching teacher by name:', error);
    }
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    fetchTeachersByBranchAndSemester(e.target.value, selectedSemester);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    fetchTeachersByBranchAndSemester(selectedBranch, e.target.value);
  };

  const fetchTeachersByBranchAndSemester = async (branch, semester) => {
    if (branch && semester) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/admin/teachers/branch-semester?branchName=${branch}&semester=${semester}`, {
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
        const formattedData = data.map(teacher => ({
          name: teacher.teacher_name,
          email: teacher.email,
          password: teacher.decrypted_password,
          user_id: teacher.user_id,
          is_active: teacher.is_active
        }));

        onSearch(formattedData);
      } catch (error) {
        console.error('Error fetching teachers by branch and semester:', error);
      }
    } else {
      fetchInitialTeachers();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input 
          type="text" 
          placeholder="Search" 
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)} 
        />
        <button className='search' onClick={handleSearch}>Search</button>
        <Link to="/admin/add-teacher">
          <button className="add-teacher-btn">Add New Teacher</button>
        </Link>
      </div>

      <div className="filter-options">
        <select value={selectedBranch} onChange={handleBranchChange}>
          <option value="">Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        
        <select value={selectedSemester} onChange={handleSemesterChange}>
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
