import React from 'react';

const BranchTable = ({ branches, setBranches }) => {
  const handleDelete = async (index) => {
    const token = localStorage.getItem('token');
    const branch = branches[index];
    const updatedBranches = [...branches];
    const newStatus = !branch.is_active;  // Toggle the is_active status

    try {
      const res = await fetch(`http://localhost:3000/api/admin/branches/update`, {
        method: 'PUT', // Assuming it's a PUT request
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch_id: branch.branch_id,
          is_active: newStatus
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update branch status');
      }

      // If API call is successful, update local state
      updatedBranches[index].is_active = newStatus;
      setBranches(updatedBranches);  // Update the state in the parent component

    } catch (error) {
      console.error("Error updating branch status:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="branch-table">
      {branches.length === 0 ? (
        <div className="no-branches">No branches found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Branch Name</th>
              <th>No. of Students</th>
              <th>No. of Subjects</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, index) => (
              <tr key={branch.id || index} className={branch.is_active ? '' : 'deleted'}>
                <td>{index + 1}</td>
                <td>{branch.branch_name}</td>
                <td>{branch.student_count}</td>
                <td>{branch.subject_count}</td>
                <td>
                  <button
                    className={`delete-btn ${!branch.is_active ? 'add-btn' : 'delete-btn'}`}
                    onClick={() => handleDelete(index)}
                    aria-label={branch.is_active ? 'Delete Branch' : 'Restore Branch'}
                  >
                    {branch.is_active ?  '✗' : '✓' }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BranchTable;
