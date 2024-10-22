import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './BarChart.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceTrendChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [], // Start with an empty datasets array
    });

    // Define an array of colors for subjects
    const colors = [
    '#005A9C', // Light Blue
    '#00008B', // Medium Blue
    '#007fff', // Darker Blue
    '#00bfff', // Lighter Blue
     
        // Add more colors if needed
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await fetch('http://192.168.1.17:3000/api/students/attendance-trend', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const subjects = await response.json();
                console.log(subjects); // Log the fetched data to check its structure

                const labels = subjects.map(subject => subject.sub_initials);
                const data = subjects.map((subject, index) => parseFloat(subject.percentage));

                // Prepare the datasets with different colors for each subject
                const datasets = labels.map((label, index) => ({
                    label: label,
                    data: [data[index]], // Make sure to wrap it in an array for each subject
                    backgroundColor: colors[index % colors.length], // Use modulo for colors array
                    borderColor: colors[index % colors.length].replace('0.6', '1'), // Set border color
                    borderWidth: 1,
                }));

                setChartData({
                    labels,
                    datasets,
                });
            } catch (error) {
                console.error('Error fetching attendance trend data:', error);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to resize properly on mobile
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Percentage',
                },
                ticks: {
                    font: {
                        size: window.innerWidth < 800 ? 10 : 14, // Smaller font for mobile
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Subjects',
                },
                ticks: {
                    font: {
                        size: window.innerWidth < 800 ? 10 : 14, // Smaller font for mobile
                    },
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: window.innerWidth < 800 ? 10 : 14, // Smaller font for mobile
                    },
                },
            },
            title: {
                display: true,
                text: 'Attendance Trend by Subject',
                font: {
                    size: window.innerWidth < 800 ? 14 : 18, // Adjust title size based on screen size
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default AttendanceTrendChart;
