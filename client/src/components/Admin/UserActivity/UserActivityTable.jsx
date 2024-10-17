import React, { useEffect, useState } from 'react';
import './UserActivityTable.css'; // Custom CSS for User Activity Table

const UserActivityTable = ({ userType, date, tableType, onPrev, onNext }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                
                let url = '';
                if (tableType === 'log') {
                    // API for User Logs
                    url = 'http://localhost:3000/api/admin/user-logs';
                } else if (tableType === 'activity') {
                    // API for User Activity 
                    url = 'http://localhost:3000/api/admin/user-activity'; 
                } else if (tableType === 'email') {
                    // API for Email Activity
                    url = 'http://localhost:3000/api/admin/user-email'; 
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    setActivities(result.data);
                }
            } catch (error) {
                console.error(`Error fetching ${tableType} data:`, error);
            }
        };

        fetchActivities();
    }, [tableType]);

    return (
        <div className="user-activity-table">
            <h3>
                {tableType === 'log' && 'User Logs'}
                {tableType === 'activity' && 'User Activity'}
                {tableType === 'email' && 'Email Activity'}
            </h3>

            {/* Arrow buttons above the table headers */}
            <div className="arrow-container">
                <button className="prev-arrow" onClick={onPrev}>
                    &#9664;
                </button>
                <button className="next-arrow" onClick={onNext}>
                    &#9654;
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>S. No</th>
                        {tableType === 'email' ? <th>Email</th> : <th>Name</th>}
                        <th>Timestamp</th>
                        {tableType === 'email' ? <th>Email Subject</th> : <th>Event Type</th>}
                        {(tableType === 'activity' || tableType === 'email') && <th>Message</th>}
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity, index) => (
                        <tr key={activity.id}>
                            <td>{index + 1}</td>
                            {tableType === 'email' ? (
                                <>
                                    <td>{activity.email}</td>
                                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                                    <td>{activity.subject}</td>
                                    <td>{activity.message}</td>
                                </>
                            ) : (
                                <>
                                    <td>{activity.user_name}</td>
                                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                                    <td>{activity.action}</td>
                                    {tableType === 'activity' && <td>{activity.message}</td>} 
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserActivityTable;
