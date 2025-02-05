import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [voterID, setVoterID] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, dob, gender, mobileNumber, permanentAddress, currentAddress, aadharNumber, panNumber, voterID, email, username, password }),
        credentials: 'include'
      });
      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container">
        <h2>CitizenSahayog Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                pattern="^[a-zA-Z\s]+$" 
                title="Name should only contain letters and spaces" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth:</label>
              <input 
                type="date" 
                id="dob" 
                name="dob" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select 
                id="gender" 
                name="gender" 
                value={gender} 
                onChange={e => setGender(e.target.value)} 
                required >
                <option value="" disabled>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number:</label>
              <input 
                type="tel" 
                id="mobileNumber" 
                name="mobileNumber" 
                pattern="[0-9]{10}" 
                value={mobileNumber} 
                onChange={e => setMobileNumber(e.target.value)} 
                required 
                title="Please enter a valid 10-digit mobile number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="permanentAddress">Permanent Address:</label>
            <textarea 
              id="permanentAddress" 
              name="permanentAddress" 
              rows="3" 
              value={permanentAddress} 
              onChange={e => setPermanentAddress(e.target.value)} 
              required 
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="currentAddress">Current Address:</label>
            <textarea 
              id="currentAddress" 
              name="currentAddress" 
              rows="3" 
              value={currentAddress} 
              onChange={e => setCurrentAddress(e.target.value)} 
            ></textarea>
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="aadhaarNumber">Aadhaar Number:</label>
              <input 
                type="text" 
                id="aadhaarNumber" 
                name="aadhaarNumber" 
                pattern="[0-9]{12}" 
                value={aadharNumber} 
                onChange={e => setAadharNumber(e.target.value)} 
                required 
                title="Please enter a valid 12-digit Aadhaar number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="panNumber">PAN Number (if available):</label>
              <input 
                type="text" 
                id="panNumber" 
                name="panNumber" 
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" 
                value={panNumber} 
                onChange={e => setPanNumber(e.target.value)} 
                title="Please enter a valid PAN number in format: ABCDE1234F"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="voterID">Voter ID (if available):</label>
            <input 
              type="text" 
              id="voterID" 
              name="voterID" 
              value={voterID} 
              onChange={e => setVoterID(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              title="Please enter a valid email address"
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                pattern=".{8,}" 
                title="Password must be at least 8 characters long"
              />
            </div>
          </div>

          <div className="form-group">
            <button type="submit">Register</button>
          </div>
          <div className="form-group1">
            <Link to="/login">Click here to login</Link>
          </div>
        </form>
      </div>
    </>
  );
}
