import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './BarChart.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceTrendChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Attendance Percentage',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await fetch('http://localhost:3000/api/students/attendance-trend', {
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
                const data = subjects.map(subject => parseFloat(subject.percentage));

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Attendance Percentage',
                            data,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
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
