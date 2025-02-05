import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to access passed state

export default function Otp() {
  const [otpInput, setOtpInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access the state passed from AdminLogin

  // Get generatedOtp from location.state
  const generatedOtp = location.state?.generatedOtp;

  const handleOtpChange = (e) => {
    setOtpInput(e.target.value);
  };

  const handleOtpSubmit = () => {
    // Check if the entered OTP matches the generated one
    if (otpInput === generatedOtp?.toString()) {
      // If OTP matches, navigate to the /adminlogin route
      navigate('/adminhome');
    } else {
      // If OTP is incorrect, show error
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  return (
    <div>
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h2>Admin OTP Verification</h2>
          <form>
            <div className="input-group">
              <label htmlFor="otp">OTP:</label>
              <input
                type="number"
                id="otp"
                placeholder="Enter the OTP"
                value={otpInput}
                onChange={handleOtpChange}
                required
              />
            </div>
            <button
              type="button"
              className="otp-button"
              onClick={handleOtpSubmit}
            >
              Verify OTP
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error if any */}
          </form>
        </div>
      </div>
    </div>
  );
}
