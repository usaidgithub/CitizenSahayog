import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/profile', {
      credentials: 'include', // 🔐 Required to send session cookie
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <p><strong>Full Name:</strong> {profile.full_name}</p>
        <p><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Mobile:</strong> {profile.mobile_number}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Aadhaar:</strong> {profile.aadhaar_number}</p>
        <p><strong>PAN:</strong> {profile.pan_number || 'N/A'}</p>
        <p><strong>Voter ID:</strong> {profile.voter_id || 'N/A'}</p>
        <p><strong>Permanent Address:</strong> {profile.permanent_address}</p>
        <p><strong>Current Address:</strong> {profile.current_address || 'N/A'}</p>
        <p><strong>Registered on:</strong> {new Date(profile.registration_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;
