import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AcknowledgmentDetails.css';

export default function AcknowledgmentDetails() {
    const { postId } = useParams(); // Get post ID from URL
    const [acknowledgment, setAcknowledgment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcknowledgment = async () => {
            try {
                const response = await fetch(`http://localhost:5000/fetch_acknowledgment/${postId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch acknowledgment details');
                }
                const data = await response.json();
                setAcknowledgment(data);
            } catch (error) {
                console.error('Error fetching acknowledgment details:', error);
            }
        };
        fetchAcknowledgment();
    }, [postId]);

    return (
        <div className="acknowledgment-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            {acknowledgment ? (
                <div className="acknowledgment-card">
                    <h2>Acknowledgment Details</h2>
                    <p><strong>Officer Name:</strong> {acknowledgment.officer_name}</p>
                    <p><strong>Designation:</strong> {acknowledgment.designation}</p>
                    <p><strong>Department:</strong> {acknowledgment.department}</p>
                    <p><strong>Assigned Authority:</strong> {acknowledgment.assigned_authority}</p>
                    <p><strong>Ward:</strong> {acknowledgment.ward}</p>
                    <p><strong>Expected Resolution Date:</strong> {new Date(acknowledgment.expected_resolution).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {acknowledgment.status}</p>
                    <p><strong>Remarks:</strong> {acknowledgment.remarks}</p>
                    <p><strong>Action Plan:</strong> {acknowledgment.action_plan}</p>
                    <p><strong>Acknowledged on:</strong> {new Date(acknowledgment.created_at).toLocaleDateString()}</p>
                    <p><strong>Expected Cost:</strong> ₹{acknowledgment.expected_cost}</p>
                </div>
            ) : (
                <p>Post not acknowledged yet,Status:Pending....</p>
            )}
        </div>
    );
}
