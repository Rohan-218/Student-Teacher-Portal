import React, { useState, useEffect } from 'react';
import './StudentScoreBoard.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentScoreboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [openSubjects, setOpenSubjects] = useState({});
  const [examId, setExamId] = useState(1);
  const [exam, setExam] = useState(''); // Initially no exam selected
  const [exams, setExams] = useState([]); // State to hold fetched exams

  // Function to fetch exams from the API
  const fetchExams = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      const response = await fetch('http://localhost:3000/api/admin/exams', {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token in the headers
        },
      });
      const data = await response.json();
      setExams(data); // Set exams in state
      if (data.length > 0) {
        setExam(data[0].exam_name); // Set the first exam name by default
        setExamId(data[0].exam_id); // Set the first exam ID by default
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  // Function to fetch marks for all subjects based on the selected exam
  const fetchMarks = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      const response = await fetch(`http://localhost:3000/api/students/marks/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token in the headers
        },
      });
      const results = await response.json();
      const uniqueSubjects = results.filter(
        (subject, index, self) =>
          index === self.findIndex((s) => s.subject_code === subject.subject_code)
      ); // Ensure unique subjects based on subject_code
      setSubjects(uniqueSubjects); // Set subjects with no repetition
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  // Fetch exams when the component mounts
  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch marks when the examId changes
  useEffect(() => {
    if (examId) {
      fetchMarks();
    }
  }, [examId]);

  const toggleSubject = (code) => {
    setOpenSubjects((prevState) => ({
      ...prevState,
      [code]: !prevState[code],
    }));
  };

  const handleExamChange = (e) => {
    const selectedExam = exams.find((exam) => exam.exam_name === e.target.value);
    if (selectedExam) {
      setExamId(selectedExam.exam_id); // Update examId based on selection
      setExam(selectedExam.exam_name); // Update exam name
    }
  };

  const getPieChartData = (marksObtained, maxMarks) => {
    return {
      labels: ['Marks Obtained', 'Remaining Marks'],
      datasets: [
        {
          data: [marksObtained, maxMarks - marksObtained],
          backgroundColor: ['#a8a8a8', '#d9d9d9'],
          hoverBackgroundColor: ['#a8a8a8', '#d9d9d9'],
        },
      ],
    };
  };

  return (
    <div className="Student-scoreboard-section">
      <div className="student-header">
        {/* Exam Dropdown */}
        <div className="student-exam-dropdown">
          <select id="student-exam-select" value={exam} onChange={handleExamChange}>
            <option value="">Select Exam</option>
            {exams.map((examOption) => (
              <option key={examOption.exam_id} value={examOption.exam_name}>
                {examOption.exam_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {Array.isArray(subjects) && subjects.length > 0 ? (
        subjects.map((subject) => (
          <div key={subject.subject_code} className="student-subject-bar">
            <div className="student-subject-header" onClick={() => toggleSubject(subject.subject_code)}>
              <span>{subject.subject_code}</span>
              <button className="student-dropdown-button">
                {openSubjects[subject.subject_code] ? '▲' : '▼'}
              </button>
            </div>
            {openSubjects[subject.subject_code] && (
              <div className="student-subject-details">
                <div className="student-subject-info">
                  <p>Subject Name: {subject.subject_name}</p>
                  <p>Marks Obtained: {subject.marks_obtained}</p>
                  <p>Maximum Marks: {subject.maximum_marks}</p>
                  <p>Percentage: {subject.percentage}%</p>
                </div>
                <div className="student-subject-chart">
                  <Pie data={getPieChartData(subject.marks_obtained, subject.maximum_marks)} />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No marks data available.</p>
      )}
    </div>
  );
};

export default StudentScoreboard;
