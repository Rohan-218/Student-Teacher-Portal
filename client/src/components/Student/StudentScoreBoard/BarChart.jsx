import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './BarChart.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]); // State for exams
  const [selectedExam, setSelectedExam] = useState(''); // State for selected exam

  // Define different shades of blue
  const blueShades = [
    '#005A9C', // Light Blue
    '#00008B', // Medium Blue
    '#007fff', // Darker Blue
    '#00bfff', // Lighter Blue
    '#005A9C', // Light Blue
    '#00008B', // Medium Blue
    '#007fff', // Darker Blue
    '#00bfff', // Lighter Blue
    
    // Add more shades if needed
  ];

  // Function to fetch exams from the API
  const fetchExams = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      const response = await fetch('http://localhost:3000/api/admin/exams', {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token in the headers
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }
      const data = await response.json();
      setExams(data); // Set exams in state
      if (data.length > 0) {
        setSelectedExam(data[0].exam_name); // Set the first exam name by default
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  // Function to fetch marks performance data
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/students/marksPerformance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      const rawData = await response.json();

      // Create a map of all subjects and set percentage to 0 for exams with no marks data
      const subjectsMap = {};
      exams.forEach(exam => {
        subjectsMap[exam.exam_name] = {};
      });
      
      rawData.forEach(item => {
        const { exam_name, sub_initials, percentage } = item;
        if (!subjectsMap[exam_name][sub_initials]) {
          subjectsMap[exam_name][sub_initials] = 0;
        }
        subjectsMap[exam_name][sub_initials] = parseFloat(percentage);
      });

      // Prepare data for chart
      const labels = Object.keys(subjectsMap); // Exam names as labels
      const datasets = Object.keys(subjectsMap).map((examName, index) => {
        const examSubjects = subjectsMap[examName];
        const subjectNames = Object.keys(examSubjects);
        const percentages = subjectNames.map(subject => examSubjects[subject] || 0);
        return {
          label: examName,
          data: percentages,
          backgroundColor: blueShades[index % blueShades.length], // Use index to pick color
        };
      });

      setChartData({
        labels: Object.keys(subjectsMap[Object.keys(subjectsMap)[0]]), // Subject names as x-axis labels
        datasets: datasets
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      setLoading(false);
    }
  };

  // Fetch exams when the component mounts
  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch data when exams are loaded
  useEffect(() => {
    if (exams.length > 0) {
      fetchData();
    }
  }, [exams]);

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
