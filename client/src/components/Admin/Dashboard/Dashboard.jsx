import React, { useState, useEffect } from 'react';
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
import student from '/src/assets/AdminSiderbar_icons/student.png';
import teacher from '/src/assets/AdminSiderbar_icons/teacher.png';
import subject from'/src/assets/AdminSiderbar_icons/sub.png';
import branch from'/src/assets/AdminSiderbar_icons/branchs.png';
import rightbutton  from'/src/assets/Admin/Dashboard/back-button-right.png';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);

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

     } catch (error) {
        console.error('Error fetching branch student counts:', error);
      }
    };
  
    fetchCounts();
    fetchBranchStudentCounts();
  }, []);

  return (
    <div className="addashboard-container">
      <Header />
      <Sidebar />
      <main className="addashboard">
        <h1 className="adwelcome">Welcome <span className="adadmin-highlight">Admin!</span></h1>
        <div className="adcards-container">
          <div className="adcard">
             <span>Students<br/></span>
              <div className='divi'>
                <img src={student} alt="Student Icon" className="Icon"></img>
              </div>
              <div><a>{studentCount || 'Loading...'}</a></div>
              <div className='viewbb'>
                  <p>view page
                  <img src={rightbutton} alt="view button" className="vb" /></p>
              </div>
          </div>


          <div className="adcard">
            <span>Teachers<br/></span>
             <div className='divi'>
                  <img src={teacher} alt="Teacher Icon" className="Icon" />
              </div>
             <div><a>{teacherCount || 'Loading...'}</a></div>
             <div className='viewbb'>
                  <p>view page
                  <img src={rightbutton} alt="view button" className="vb" /></p>
              </div>
           </div>


          <div className="adcard">
          <span>Branches<br/></span>
              <div className='divi'>
                 <img src={branch} alt="Branch Icon" className="Icon" />
              </div>
               <div><a>{branchCount  || 'Loading...'}</a></div>
               <div className='viewbb'>
                  <p>view page
                  <img src={rightbutton} alt="view button" className="vb" /></p>
              </div>
           </div>


          <div className="adcard">
          <span>Subjects<br/></span>
          <div className='divi'>
            <img src={subject} alt="Subject Icon" className="Icon" />
            </div>
          <div><a> {subjectCount || 'Loading...'}</a></div> 
          <div className='viewbb'>
                  <p>view page
                  <img src={rightbutton} alt="view button" className="vb" /></p>
              </div>
            </div>
        </div>
                
        <div className="photo">
          
        </div> 
      </main>
    </div>
  );
};

export default Dashboard;
