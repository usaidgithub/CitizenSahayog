import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminReports.css";

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:5000/get_reports");
                if (!response.ok) {
                    throw new Error("Failed to fetch reports");
                }
                const data = await response.json();
                setReports(data);
            } catch (err) {
                setError("Error fetching reports");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);
    const fetchUserDetails = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/fetch_user_details/${postId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            setUserDetails(data);
            setShowPopup(true); // Show popup
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };
    return (
        <>
        <div className="reports-container">
            <h2>Reported Posts</h2>

            {loading ? (
                <p>Loading reports...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : reports.length === 0 ? (
                <p>No reports available</p>
            ) : (
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>REPORT ID</th>
                            <th>Post ID</th>
                            <th>Post URL</th>
                            <th>Reported By</th>
                            <th>Description</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td>{report.id}</td>
                                <td>{report.post_id}</td>
                                <td><a href={report.post_url} target="_blank" rel="noopener noreferrer">{report.post_url}</a></td>
                                <td><button onClick={() => fetchUserDetails(report.post_id)}>Verify User</button></td>
                                <td>{report.description}</td>
                                <td>{new Date(report.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      {showPopup && userDetails && (
        <div className="popup-overlay">
        <div className="popup-content">
            <h2 className="popup-title">User Credentials</h2>
            <div className="popup-details">
                <p><strong>Full Name:</strong> {userDetails.full_name}</p>
                <p><strong>Gender:</strong> {userDetails.gender}</p>
                <p><strong>Aadhaar Number:</strong> {userDetails.aadhaar_number}</p>
                <p><strong>PAN Number:</strong> {userDetails.pan_number}</p>
                <p><strong>Voter ID:</strong> {userDetails.voter_id}</p>
                <p><strong>Current Address:</strong> {userDetails.current_address}</p>
                <p><strong>Phone Number:</strong> {userDetails.mobile_number}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
            </div>
            <button className="cancel-button" onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
    </div>
)}  
</>
    );
}
