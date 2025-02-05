import React, { useState } from 'react';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;  // Prevent sending empty messages
        try {
            const res = await fetch('http://127.0.0.1:5001/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setResponses([...responses, { user: message, bot: data.response }]);
            setMessage(''); // Clear the message input after sending
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevent default Enter behavior
            handleSubmit(e);     // Trigger submit on Enter
        }
    };

    return (
        <div className="chat-container">
            <style>
                {`
                    .chat-container {
                        width: 100%;
                        max-width: 500px;
                        margin: auto;
                        background-color: #fff;
                        border-radius: 15px;
                        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                        height: 90vh;
                        overflow: hidden;
                    }

                    .chat-header {
                        background-color: #4A90E2;
                        padding: 15px;
                        color: white;
                        font-size: 1.5rem;
                        text-align: center;
                        border-top-left-radius: 15px;
                        border-top-right-radius: 15px;
                    }

                    .chat-messages {
                        flex: 1;
                        padding: 10px;
                        overflow-y: auto;
                        background-color: #f9f9f9;
                    }

                    .message {
                        margin-bottom: 10px;
                        max-width: 80%;
                        padding: 10px;
                        border-radius: 15px;
                    }

                    .message.user {
                        background-color: #4A90E2;
                        color: white;
                        align-self: flex-end;
                    }

                    .message.bot {
                        background-color: #e5e5e5;
                        color: black;
                        align-self: flex-start;
                    }

                    .input-container {
                        display: flex;
                        padding: 10px;
                        background-color: #fff;
                        border-top: 1px solid #ddd;
                    }

                    input {
                        flex-grow: 1;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 20px;
                        margin-right: 10px;
                    }

                    button {
                        padding: 10px 20px;
                        background-color: #4A90E2;
                        color: white;
                        border: none;
                        border-radius: 20px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        margin-bottom:10px
                    }

                    button:hover {
                        background-color: #357ab8;
                    }
                `}
            </style>
            <div className="chat-header">
                CITIZEN SAHAYOG CHATBOT
            </div>
            <div className="chat-messages">
                {responses.map((response, index) => (
                    <div key={index} className="message">
                        <div className="message user"><strong>You:</strong> {response.user}</div>
                        <div className="message bot"><strong>Bot:</strong> {response.bot}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}  // Add this handler for Enter key
                    placeholder="Type your message here..."
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
