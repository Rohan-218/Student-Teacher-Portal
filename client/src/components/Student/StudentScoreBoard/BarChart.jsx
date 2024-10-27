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
    '#7AB2D3', // Light Blue
    '#48CAE4', // Medium Blue
    '#0077B6', // Darker Blue
    '#ADE8F4', // Lighter Blue
    '#57A0D2', // Light Blue
    '#48CAE4', // Medium Blue
    '#0077B6', // Darker Blue
    '#ADE8F4', // Lighter Blue
    
    // Add more shades if needed
  ];

  // Function to fetch exams from the API
  const fetchExams = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
      const response = await fetch('http://localhost:3000/api/students/exams', {
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
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      const rawData = await response.json();
  
      // Create a subjectsMap with subject initials as keys
      const subjectsMap = {};
      rawData.forEach(item => {
        const { exam_name, sub_initials, percentage } = item;
        if (!subjectsMap[sub_initials]) {
          subjectsMap[sub_initials] = {}; // Initialize subject if not already in the map
        }
        subjectsMap[sub_initials][exam_name] = parseFloat(percentage); // Map exam to percentage
      });
  
      // Extract subject initials for the x-axis
      const labels = Object.keys(subjectsMap);
  
      // Create datasets for each exam
      const datasets = exams.map((exam, index) => {
        return {
          label: exam.exam_name,
          data: labels.map(label => subjectsMap[label][exam.exam_name] || 0), // Get percentage for each exam, or 0 if missing
          backgroundColor: blueShades[index % blueShades.length],
        };
      });
  
      // Set chart data with labels (subject initials) and datasets
      setChartData({
        labels, // Subject initials as labels
        datasets, // Data for each exam
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
        title: {
          display: true,
          text: 'Percentage',
      },
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`, // Show percentages
          font: {
            size: window.innerWidth < 800 ? 10 : 14 // Adjust font size for mobile
          }
        },
      },
      x: {
        title: {
          display: true,
          text: 'Subjects',
      },
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
