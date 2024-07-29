import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { sendMessage } from '../services/MessageService';
import './SendMessage.css';

function SendMessage() {
  const { token } = useContext(AuthContext);
  const { username } = useParams();
  const [receiverUsername, setReceiverUsername] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      setReceiverUsername(username);
    }
    console.log('Component mounted, useEffect called');
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit triggered');
    console.log('Sending message:', {
      token,
      receiverUsername,
      content
    });
    sendMessage(token, receiverUsername, content)
      .then(() => {
        console.log('Message sent successfully');
        setSuccess(true);
        setError('');
        setReceiverUsername('');
        setContent('');
        navigate('/messages');
      })
      .catch((error) => {
        console.error('Error sending message:', error.response ? error.response.data : error);
        setError('Failed to send message');
        setSuccess(false);
      });
  };

  return (
    <div>
      <h1>Send Message</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            To:
            <input
              type="text"
              value={receiverUsername}
              onChange={(e) => setReceiverUsername(e.target.value)}
              disabled={!!username}
            />
          </label>
        </div>
        <div>
          <label>
            Message:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here"
            ></textarea>
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Message sent successfully!</p>}
        <button className="button" type="submit">Send</button>
      </form>
    </div>
  );
}

export default SendMessage;
