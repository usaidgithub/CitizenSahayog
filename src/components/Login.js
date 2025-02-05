import React, { useState } from 'react';
import './Login.css';
import {Link,useNavigate} from "react-router-dom"
export default function Login() {
  const navigate=useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('')

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:5000/login_user',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });
    if (response.ok) {
        navigate('/myposts')// Redirect to homepage or another page
    } else {
        const errorMessage = await response.text();
        setError(errorMessage);
    }
    }
    catch(error){
      console.log(error)
    }
  };

  return (
    <div className='container1'>
    <div className="login-container">
      <h2>CitizenSahayog Login</h2>
      <form onSubmit={handleSubmit}>
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
          />
        </div>

        <div className="form-group">
          <button type="submit">Login</button>
        </div>

        <div className="form-group">
          <Link to="/register" className="forgot-password">Register Here</Link>
          {error && <p className="error" style={{color:'red'}}>{error}</p>}
        </div>
      </form>
    </div>
    </div>
  );
}
