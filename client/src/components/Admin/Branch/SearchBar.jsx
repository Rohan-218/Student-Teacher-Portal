import React, { useState } from 'react';
import './SearchBar.css';
import { Link } from 'react-router-dom';

const SearchBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({ branch_name: '', semester: '' });

  // Handle input change for both the text input and the dropdown
  const handleChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(updatedFilters);

    // Automatically trigger filtering when the dropdown changes
    if (e.target.name === 'semester') {
      onFilter(updatedFilters); // Trigger filtering immediately for dropdown change
    }
  };

  // Handle search button click
  const handleSearch = () => {
    onFilter(filters); // Trigger filtering with current filters
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search"
          name="branch_name"
          value={filters.branch_name}
          onChange={handleChange}
          aria-label="Search Branch Name"
        />
        <button onClick={handleSearch}>Search</button> {/* Search button */}
        <Link to="/admin/add-branch">
          <button className="add-branch-btn">Add New Branch</button>
        </Link>
      </div>

      <div className="filter-options">
        <select
          name="semester"
          value={filters.semester}
          onChange={handleChange}
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
