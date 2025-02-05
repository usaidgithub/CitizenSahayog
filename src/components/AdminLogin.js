import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom"; // To navigate to OTP page

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null); // Store OTP here
  const navigate = useNavigate();

  const handleAdminIdChange = (e) => {
    setAdminId(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      // Send POST request to backend to verify adminId and get OTP
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, phoneNumber }), // Include phone number if needed
        credentials: 'include',
      });

      // Parse response as JSON
      const data = await response.json();

      if (data.success) {
        // If adminId is valid, store the generated OTP and navigate to the OTP page
        setGeneratedOtp(data.otp);
        console.log('Generated OTP:', data.otp); // Print OTP on console
        navigate("/otp", { state: { generatedOtp: data.otp } }); // Pass OTP to Otp component
      } else {
        // Display error message if login failed
        setErrorMessage(data.message || "Invalid Admin ID or Phone Number.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while trying to log in.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="admin_id">Admin ID:</label>
            <input
              type="text"
              id="admin_id"
              value={adminId}
              onChange={handleAdminIdChange}
              placeholder="Enter Admin ID"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="tel"
              id="phone_number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>
          <button type="button" className="otp-button" onClick={handleSendOtp}>
            Send OTP
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error if any */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
