import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './StudentScoreboard.css';
import Header from '../../../common/Admin/Header';

// Color scheme for pie charts
const COLORS = ['#CD84A3', '#CBDEE6'];

const StudentScoreboard = () => {
  const [openAccordions, setOpenAccordions] = useState([]); // Track open accordions
  const [exams, setExams] = useState([]); // State to hold exam data
  const [selectedExam, setSelectedExam] = useState(""); // State for selected exam
  const [marksData, setMarksData] = useState([]); // State to hold marks data
  const { userId } = useParams(); // Replace this with actual user ID as needed

  useEffect(() => {
    // Fetch exams from API
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await fetch('http://localhost:3000/api/admin/exams', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }
        const data = await response.json();
        setExams(data); // Set the fetched exams to state

        // Set the default exam to the first exam, if available
        if (data.length > 0) {
          setSelectedExam(data[0].exam_id); // Set default to the first exam
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams(); // Call the fetch function
  }, []);

  useEffect(() => {
    // Fetch marks data when an exam is selected
    const fetchMarks = async () => {
      if (selectedExam) {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          const response = await fetch(`http://localhost:3000/api/admin/students/marks/${userId}/${selectedExam}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch marks');
          }
          const data = await response.json();
          setMarksData(data); // Set marks data to state
        } catch (error) {
          console.error('Error fetching marks:', error);
        }
      }
    };

    fetchMarks(); // Call the fetch function
  }, [selectedExam]); // Dependency on selectedExam

  const toggleAccordion = (index) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((i) => i !== index)); // Remove index if it's already open
    } else {
      setOpenAccordions([...openAccordions, index]); // Add index if it's not open
    }
  };

  // Data for pie chart (for each subject)
  const getPieChartData = (marksObtained, maxMarks) => [
    { name: 'Obtained', value: marksObtained },
    { name: 'Remaining', value: maxMarks - marksObtained },
  ];

  // Bar chart data
  const barChartData = marksData.map((subject) => ({
    name: subject.sub_initials,
    percentage: subject.percentage,
  }));

  return (
    <div className='st-marks'>
      <Header />
      <div className="stscoreboard-container">
        <div className="stscoreboard-header">
          <Link to={`/admin/student-profile/${userId}`}>
            <button className="back-button">←</button>
          </Link>
          <h1 className="st-title">SCOREBOARD</h1>
          <div className="stexam-dropdown">
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
              <option value="">Exam</option>
              {exams.map((exam) => (
                <option key={exam.exam_id} value={exam.exam_id}>
                  {exam.exam_name} {/* Assuming the exam object has id and name properties */}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accordions */}
        {marksData.length > 0 ? (
          marksData.map((item, index) => (
            <div key={index} className={`staccordion ${openAccordions.includes(index) ? 'open' : ''}`}>
              <div className="staccordion-header" onClick={() => toggleAccordion(index)}>
                <p>{item.subject_name} ({item.subject_code})</p>
                <span className="staccordion-arrow">{openAccordions.includes(index) ? '⌄' : '⌄'}</span>
              </div>
              {openAccordions.includes(index) && (
                <div className="staccordion-content">
                  <div className="staccordion-details">
                    <p><strong>Subject Code:</strong> {item.subject_code}</p>
                    <p><strong>Subject Name:</strong> {item.subject_name}</p>
                    <p><strong>Marks Obtained:</strong> {item.marks_obtained}</p>
                    <p><strong>Maximum Marks:</strong> {item.maximum_marks}</p>
                    <p><strong>Percentage Obtained:</strong> {item.percentage}%</p>
                  </div>
                  <div className="staccordion-chart">
                    <PieChart width={120} height={120}>
                      <Pie
                        data={getPieChartData(item.marks_obtained, item.maximum_marks)}
                        dataKey="value"
                        outerRadius={40}
                        fill="#eac6ff"
                      >
                        {getPieChartData(item.marks_obtained, item.maximum_marks).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No marks data available.</p>
        )}

        {/* Bar Chart for all subjects */}
        <div className="stall-subjects-chart">
          <h3>All Subjects Performance:</h3>
          <BarChart className='st-barchart'
            width={400}
            height={300}
            data={barChartData}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" fill="#9bbace" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StudentScoreboard;
