import React, { useState, useEffect } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import SearchBar from './SearchBar';
import SubjectTable from './SubjectTable';
import './SubjectList.css';

const SubjectList = () => {
  const [filters, setFilters] = useState({
    branch_name: null,
    semester: null,
    subject_name: null
  });

  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async (filters) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();

      // Apply filters only if they are not null
      if (filters.branch_name) {
        params.append('branchName', filters.branch_name);
      }
      if (filters.semester) {
        params.append('semester', filters.semester);
      }
      if (filters.subject_name) {
        params.append('subject_name', filters.subject_name); // Ensure 'name' is being set
      }

      const apiUrl = `http://localhost:3000/api/admin/subjects?${params.toString()}`;
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError("No subjects found matching the filters.");
        setSubjects([]);
      } else {
        setSubjects(data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    const updatedFilters = {
      branch_name: newFilters.branch_name || null,
      semester: newFilters.semester || null,
      subject_name: newFilters.subject_name || null
    };

    setFilters(updatedFilters);
    fetchSubjects(updatedFilters);
  };

  useEffect(() => {
    fetchSubjects(filters);
  }, []);

  return (
    <div className="subject-list">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="container">
          <SearchBar onFilter={handleFilter} />
          {loading && <p>Loading subjects...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && subjects.length === 0 && (
            <p className="no-subjects-message">No subjects found matching the filters.</p>
          )}
          {!loading && !error && subjects.length > 0 && (
            <SubjectTable subjects={subjects} setSubjects={setSubjects} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
