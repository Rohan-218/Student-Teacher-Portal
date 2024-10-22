import React, { useState, useEffect } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import SearchBar from './SearchBar'; 
import BranchTable from './BranchTable'; 
import './BranchList.css';  

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch branches based on filters
  const fetchBranches = async (filters) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (filters.branch_name) {
        params.append('branch_name', filters.branch_name);
      }
      if (filters.semester) {
        params.append('semester', filters.semester);
      }

      const apiUrl = `http://localhost:3000/api/admin/branches?${params.toString()}`;
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch branches');
      }

      const data = await res.json();
      setBranches(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches({}); // Fetch all branches initially
  }, []);

  const handleFilter = (filters) => {
    fetchBranches(filters); // Fetch branches based on applied filters
  };

  return (
    <>
      <Header />
      <Sidebar />
    <div className="branch-list">
      <div className="main-content">
        <div className="container">
          <SearchBar onFilter={handleFilter} />
          {loading && <div className="loading-message">Loading branches...</div>}
          {error && <div className="error-message">{error}</div>}
          <BranchTable branches={branches} setBranches={setBranches} />
        </div>
      </div>
    </div>
    </>
  );
};

export default BranchList;
