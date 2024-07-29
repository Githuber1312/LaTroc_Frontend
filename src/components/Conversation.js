import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { getMessages, sendMessage, markAsRead } from '../services/MessageService';
import './Conversation.css';

function Conversation() {
  const { id } = useParams();
  const { token, username } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/users/${id}`)
      .then(response => {
        console.log("Fetched user:", response.data);
        setReceiverUsername(response.data.username);
      })
      .catch(error => console.error('Error fetching user:', error.response ? error.response.data : error));
  }, [id]);

  useEffect(() => {
    if (token) {
      getMessages(token)
        .then((response) => {
          console.log("Messages received from backend:", response.data);
          const filteredMessages = response.data.filter(
            (message) =>
              (message.sender.id === parseInt(id) && message.receiver.username === username) ||
              (message.receiver.id === parseInt(id) && message.sender.username === username)
          );
          setMessages(filteredMessages);
          markMessagesAsRead(filteredMessages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error.response ? error.response.data : error);
        });
    }
  }, [token, id, username]);

  const markMessagesAsRead = (messages) => {
    messages.forEach(message => {
      if (message.receiver.username === username && !message.read) {
        markAsRead(token, message.id)
          .then(() => {
          })
          .catch(error => {
            console.error('Error marking message as read:', error);
          });
      }
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Sending message:', {
      token,
      receiverUsername,
      content
    });
    if (!receiverUsername) {
      console.error('Receiver username is empty');
      setError('Receiver username is not set.');
      return;
    }
    sendMessage(token, receiverUsername, content)
      .then(() => {
        console.log('Message sent successfully');
        setMessages([...messages, {
          id: Date.now(),
          sender: { username },
          receiver: { username: receiverUsername },
          content,
          timestamp: new Date().toISOString(),
          read: false
        }]);
        setContent('');
        setSuccess(true);
        setError('');
      })
      .catch((error) => {
        console.error('Error sending message:', error.response ? error.response.data : error);
        setError('Failed to send message');
        setSuccess(false);
      });
  };

  return (
    <div className="conversation-container">
      <h1>Conversation</h1>
      <ul className="conversation-list">
        {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message) => (
          <li 
            key={message.id} 
            className={`${message.read ? 'read' : 'unread'} ${message.sender.username === username ? 'sent' : 'received'}`}
          >
            <p><strong>{message.sender.username}:</strong> {message.content}</p>
            <p>{new Date(message.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here"
        ></textarea>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Message sent successfully!</p>}
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Conversation;
