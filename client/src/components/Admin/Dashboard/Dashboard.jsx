import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import './Dashboard.css';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] }); 

   // Fetch the counts from APIs
   useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
        const headers = {
          'Authorization': `Bearer ${token}`,  // Send token in headers
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        };
  
        const studentRes = await fetch('http://localhost:3000/api/admin/students/count', { headers });
        if (!studentRes.ok) throw new Error(`Failed to fetch: ${studentRes.statusText}`);
        const studentData = await studentRes.json();
        setStudentCount(studentData.studentCount);
  
        const teacherRes = await fetch('http://localhost:3000/api/admin/teachers/count', { headers });
        if (!teacherRes.ok) throw new Error(`Failed to fetch: ${teacherRes.statusText}`);
        const teacherData = await teacherRes.json();
        setTeacherCount(teacherData.teacherCount);
  
        const branchRes = await fetch('http://localhost:3000/api/admin/branches/count', { headers });
        if (!branchRes.ok) throw new Error(`Failed to fetch: ${branchRes.statusText}`);
        const branchData = await branchRes.json();
        setBranchCount(branchData.branchCount);
  
        const subjectRes = await fetch('http://localhost:3000/api/admin/subjects/count', { headers });
        if (!subjectRes.ok) throw new Error(`Failed to fetch: ${subjectRes.statusText}`);
        const subjectData = await subjectRes.json();
        setSubjectCount(subjectData.subjectCount);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    const fetchBranchStudentCounts = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const res = await fetch('http://localhost:3000/api/admin/branches/student-count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add your token here
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        
        // Process the branch student count data for the chart
        const labels = data.branchStudentCount.map(branch => branch.branch_name);
        const studentCounts = data.branchStudentCount.map(branch => parseInt(branch.student_count, 10));

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Students',
              data: studentCounts,
              backgroundColor: '#a2c9da', // Bar color
              borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
              borderWidth: 1,
              borderRadius: 8, // Rounded bar corners
              barThickness: 'flex', // Automatically adjust bar thickness
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching branch student counts:', error);
      }
    };
  
    fetchCounts();
    fetchBranchStudentCounts();
  }, []);

  // Options for the bar chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio for better resizing
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students', // Y-axis title
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Branches', // X-axis title
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top', // Position legend on top
      },
    },
  };

  return (
    <div className="addashboard-container">
      <Header />
      <Sidebar />
      <main className="addashboard">
        <h1 className="adwelcome">Welcome <span className="adadmin-highlight">Admin!</span></h1>
        <div className="adcards-container">
          <div className="adcard">Students<br />{studentCount || 'Loading...'}</div>
          <div className="adcard">Teachers<br />{teacherCount || 'Loading...'}</div>
          <div className="adcard">Branches<br />{branchCount  || 'Loading...'}</div>
          <div className="adcard">Subjects<br />{subjectCount || 'Loading...'}</div>
        </div>
        {/*         
        <div className="adgraph-container">
          <div className="adgraph-wrapper">
            <Bar data={chartData} options={options} />
          </div>
        </div> 
        */}

      </main>
    </div>
  );
};

export default Dashboard;
