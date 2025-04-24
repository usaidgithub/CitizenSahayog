import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReportPost.css';

export default function ReportPost() {
    const { postId } = useParams(); // Get post ID from URL
    const navigate = useNavigate();

    // State variables
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // Construct the post URL dynamically
    const postUrl = `http://localhost:3000/post/${postId}`;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim()) {
            setError('Description cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/report_post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, post_url: postUrl, description }),
                credentials: 'include'
            });

            if (!response.ok) {
                toast.error("Failed to submit report")
                throw new Error('Failed to submit report');
            }

            navigate(-1); // Go back after submission
            toast.success("Report submitted Successfully")
        } catch (err) {
            setError('Error submitting report');
        }
    };

    return (
        <div className="report-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            <h2>Report Post</h2>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="report-form">
                <label>Post ID:</label>
                <input type="text" value={postId} className="disabled-input" readOnly />

                <label>Post URL:</label>
                <input type="text" value={postUrl} className="disabled-input" readOnly />

                <label>Describe the Issue:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the problem..."
                    required
                />

                <button type="submit" className="submit-button">Submit Report</button>
            </form>
             <ToastContainer 
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
        </div>
    );
}
