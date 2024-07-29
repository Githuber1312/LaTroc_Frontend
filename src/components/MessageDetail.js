import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMessages, markAsRead } from '../services/MessageService';

function MessageDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getMessages(token)
      .then((response) => {
        const foundMessage = response.data.find((msg) => msg.id === parseInt(id, 10));
        setMessage(foundMessage);
        if (foundMessage && !foundMessage.read) {
          markAsRead(token, foundMessage.id);
        }
      })
      .catch((error) => {
        console.error('Error fetching message:', error.response ? error.response.data : error);
      });
  }, [token, id]);

  if (!message) return <div>Loading...</div>;

  return (
    <div>
      <h1>Message Detail</h1>
      <p>From: {message.sender.username}</p>
      <p>To: {message.receiver.username}</p>
      <p>{message.content}</p>
      <p>{message.timestamp}</p>
    </div>
  );
}

export default MessageDetail;
