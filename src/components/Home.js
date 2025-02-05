import React, { useState } from 'react';
import logo from '../assests/cs_logo-removebg-preview.png'; // Import the logo image
import background from '../assests/bgflag.jpg'; // Import the background image
import { Link} from 'react-router-dom';

const Homepage = () => {
    const [showLoginOptions, setShowLoginOptions] = useState(false);

    const toggleLoginOptions = () => {
        setShowLoginOptions(prev => !prev);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${background})`, // Set background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            position: 'relative',
            color: 'white',
        }}>
            {/* Background Overlay for better contrast */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 0,
            }}></div>
            
            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                width: '95%',
                height: '80px',
                position: 'absolute',
                top: '0',
                zIndex: 1,
                backgroundColor: 'rgba(74, 144, 226, 0.8)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            }}>
                <img src={logo} alt="Citizen Sahyog Logo" style={{ width: '120px', height: 'auto' }} />
                <h1 style={{
                    margin: '0',
                    fontSize: '28px',
                    letterSpacing: '1.5px',
                    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                }}>Citizen Sahyog</h1>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <a href="#" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'color 0.3s',
                    }}>Home</a>
                    <a href="#" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'color 0.3s',
                    }}>About Us</a>
                    <a href="#" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'color 0.3s',
                    }}>Notification</a>
                    <div style={{ position: 'relative' }}>
                        <button onClick={toggleLoginOptions} style={{
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            color: 'black',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            borderRadius: '5px',
                            transition: 'background-color 0.3s, transform 0.2s',
                        }}>
                            Login
                        </button>
                        <div style={{
                            display: showLoginOptions ? 'block' : 'none',
                            position: 'absolute',
                            top: '40px',
                            right: '0',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        }}>
                            <button style={{
                                display: 'block',
                                padding: '10px 20px',
                                backgroundColor: '#fff',
                                color: '#333',
                                border: 'none',
                                textAlign: 'left',
                                width: '150px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                               onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}>
                               <Link to="/login">Login as User</Link> 
                            </button>
                            <button style={{
                                display: 'block',
                                padding: '10px 20px',
                                backgroundColor: '#fff',
                                color: '#333',
                                border: 'none',
                                textAlign: 'left',
                                width: '150px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                               onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}>
                                <Link to="/adminlogin">Login as Admin</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Main content */}
            <div style={{
                marginTop: '150px',
                textAlign: 'center',
                zIndex: 1,
                padding: '0 20px',
            }}>
                <h2 style={{
                    fontSize: '36px',
                    fontFamily: "'Georgia', serif",
                    color: '#fff',
                }}>Welcome to Citizen Sahyog</h2>
                <p style={{ fontSize: '16px', color: '#ddd', maxWidth: '600px', margin: '0 auto' }}>
                    <b>Your platform to connect with the government and address your concerns.</b>
                </p>
                <p style={{ fontSize: '16px', color: '#ddd', maxWidth: '600px', margin: '10px auto' }}>
                    <b>We create a transparent and effective channel for citizens to voice their concerns, report issues, and engage with their local government. Let your voice be heard!</b>
                </p>
                <button style={{
                    padding: '8px 20px',
                    backgroundColor: 'darkcyan',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: '20px',
                    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                    letterSpacing: '1px',
                    transition: 'background-color 0.3s',
                }} onMouseEnter={(e) => e.target.style.backgroundColor = '#006666'}
                   onMouseLeave={(e) => e.target.style.backgroundColor = 'darkcyan'}>
                    Get Started
                </button>
            </div>
            
            {/* Chatbot Icon */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1,
            }}>
                <Link to="/chatbot"><button style={{
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '24px',
                }}>🤖</button></Link>
            </div>

            {/* Media queries for responsiveness */}
            <style jsx>{`
                @media (max-width: 768px) {
                    nav {
                        flex-direction: column;
                        padding: 10px 20px;
                        height: auto;
                    }
                    nav h1 {
                        font-size: 22px;
                    }
                    nav img {
                        width: 100px;
                    }
                    nav a {
                        font-size: 14px;
                    }
                    nav button {
                        font-size: 12px;
                        padding: 6px 12px;
                    }
                    h2 {
                        font-size: 28px;
                    }
                    p {
                        font-size: 14px;
                    }
                    button {
                        font-size: 14px;
                        padding: 6px 18px;
                    }
                }

                @media (max-width: 480px) {
                    h2 {
                        font-size: 24px;
                    }
                    p {
                        font-size: 12px;
                    }
                    button {
                        font-size: 12px;
                        padding: 5px 16px;
                    }
                    nav {
                        padding: 10px;
                    }
                    nav img {
                        width: 80px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Homepage;
