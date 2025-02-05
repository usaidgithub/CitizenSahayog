import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Analysis.css';  // For custom CSS styling

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Analysis() {
    const [problemData, setProblemData] = useState([]);
    const [totalProblems, setTotalProblems] = useState(0);
    const [states, setStates] = useState([]);        // List of available states
    const [cities, setCities] = useState([]);        // List of available cities
    const [selectedState, setSelectedState] = useState('');  // Selected state filter
    const [selectedCity, setSelectedCity] = useState('');    // Selected city filter

    // Fetch distinct states and cities on component mount
    useEffect(() => {
        const fetchStatesAndCities = async () => {
            try {
                const response = await fetch('http://localhost:5000/fetch_states_cities', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch states and cities');
                }
                const data = await response.json();
                setStates([...new Set(data.map(item => item.state))]);  // Unique states
                setCities([...new Set(data.map(item => item.city))]);   // Unique cities
            } catch (error) {
                console.error('Error fetching states and cities:', error);
            }
        };
        fetchStatesAndCities();
    }, []);

    // Fetch problem counts by category based on selected filters
    useEffect(() => {
        const fetchProblemCounts = async () => {
            try {
                const query = new URLSearchParams();
                if (selectedState) query.append('state', selectedState);
                if (selectedCity) query.append('city', selectedCity);

                const response = await fetch(`http://localhost:5000/fetch_problem_counts?${query.toString()}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch problem counts');
                }
                const data = await response.json();
                setProblemData(data);

                // Calculate total problems for progress bar purposes
                const total = data.reduce((acc, category) => acc + category.problem_count, 0);
                setTotalProblems(total);
            } catch (error) {
                console.error('Error fetching problem counts:', error);
            }
        };
        fetchProblemCounts();
    }, [selectedState, selectedCity]);  // Re-fetch data when state or city changes

    // Prepare data for Chart.js
    const chartData = {
        labels: problemData.map(item => item.category),
        datasets: [
            {
                label: 'Problem Count',
                data: problemData.map(item => item.problem_count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Problem Counts by Category',
            },
        },
    };

    return (
        <div className="analysis-container">
            {/* Sort By Section */}
            <div className="filter-section">
                <label htmlFor="state-select">Sort by State: </label>
                <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                >
                    <option value="">All States</option>
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>

                <label htmlFor="city-select">Sort by City: </label>
                <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                >
                    <option value="">All Cities</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="progress-bar-section">
                {problemData.map((item, index) => {
                    const progressPercentage = ((item.problem_count / totalProblems) * 100).toFixed(2);

                    return (
                        <div key={index} className="progress-bar-wrapper">
                            <span className="category-label">{item.category}</span>
                            <div className="progress-bar">
                                <div 
                                    className="progress-bar-filled" 
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    {progressPercentage}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
