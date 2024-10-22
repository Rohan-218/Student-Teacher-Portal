import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onFilter }) => {
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({ branch_name: '', semester: '', subject_name: '' });

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
          throw new Error('Failed to fetch branches');
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

  const handleSearch = () => {
    onFilter(filters);  // Trigger filtering with all current filters, including subject_name
  };

  const handleDropdownChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(updatedFilters);
    
    // Trigger filtering immediately for branch and semester
    if (e.target.name === 'branch_name' || e.target.name === 'semester') {
      onFilter(updatedFilters);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search"
          name="subject_name"
          value={filters.subject_name}
          onChange={(e) => setFilters({ ...filters, subject_name: e.target.value })}  // Handle subject name input
        />
        <button onClick={handleSearch}>Search</button>
        <Link to="/admin/add-subject">
          <button className="add-subject-btn">Add New Subject</button>
        </Link>
      </div>

      <div className="filter-options">
        <select
          name="branch_name"
          value={filters.branch_name}
          onChange={handleDropdownChange}  // Trigger filtering when branch changes
        >
          <option value="">Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <select
          name="semester"
          value={filters.semester}
          onChange={handleDropdownChange}  // Trigger filtering when semester changes
        >
          <option value="">Semester</option>
          {[...Array(8).keys()].map(i => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
