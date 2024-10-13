import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './BarChart.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]); // State for exams
  const [selectedExam, setSelectedExam] = useState(null); // State for selected exam

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
        setSelectedExam(data[0]); // Set the first exam by default
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  // Function to fetch marks for the selected exam
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/students/marksPerformance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      const rawData = await response.json();

      // Transforming the data
      const subjects = {};
      rawData.forEach(item => {
        const { sub_initials, percentage } = item;
        if (!subjects[sub_initials]) {
          subjects[sub_initials] = { percentage: 0 };
        }
        subjects[sub_initials].percentage = parseFloat(percentage);
      });

      const labels = Object.keys(subjects);
      const percentages = labels.map(subject => subjects[subject].percentage || 0);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Percentage',
            data: percentages,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Fetch exams when the component mounts
  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle exam change (only updates selected exam, does not affect the API call)
  const handleExamChange = (e) => {
    const selectedExamId = e.target.value;
    const selectedExam = exams.find(exam => exam.exam_id === selectedExamId);
    setSelectedExam(selectedExam);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to adjust height based on screen size
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`, // Show percentages
          font: {
            size: window.innerWidth < 800 ? 10 : 14 // Adjust font size for mobile
          }
        },
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 800 ? 10 : 14 // Adjust font size for mobile
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: window.innerWidth < 800 ? 10 : 14 // Adjust legend font size for mobile
          }
        }
      },
      title: {
        display: true,
        text: 'Marks per Subject',
        font: {
          size: window.innerWidth < 800 ? 14 : 18 // Adjust title font size for mobile
        }
      }
    }
  };

  return (
    <div>
      {/* Exam Dropdown */}
      <div className="exam-dropdown">
        <select value={selectedExam?.exam_id || ''} onChange={handleExamChange}>
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam.exam_id} value={exam.exam_id}>
              {exam.exam_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="chart-container">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default BarChart;
