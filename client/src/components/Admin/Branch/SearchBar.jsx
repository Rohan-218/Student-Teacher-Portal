import React, { useState } from 'react';
import './SearchBar.css';
import { Link } from 'react-router-dom';

const SearchBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({ branch_name: '', semester: '' });

  // Handle input change for both the text input and the dropdown
  const handleChange = (e) => {
    console.log(e.target.value)
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(updatedFilters);

    // Automatically trigger filtering when the input or dropdown changes
    onFilter(updatedFilters);
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="&#128269;  Search..."
          name="branch_name"
          value={filters.branch_name}
          onChange={handleChange} // Trigger filtering as soon as input changes
          aria-label="Search Branch Name"
        />
        <Link to="/admin/add-branch">
          <button className="add-branch-btn">Add New Branch</button>
        </Link>
      </div>

      <div className="filter-options">
        <select
          name="semester"
          value={filters.semester}
          onChange={handleChange} // Trigger filtering when semester changes
          aria-label="Select Semester"
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
