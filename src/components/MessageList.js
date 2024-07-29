import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMessages } from '../services/MessageService';
import './MessageList.css';

function MessageList() {
  const { token, username } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMessages(token)
      .then((response) => {
        const messages = response.data;
        const users = {};
        messages.forEach((message) => {
          const otherUser = message.sender.username === username ? message.receiver : message.sender;
          if (!users[otherUser.username]) {
            users[otherUser.username] = {
              user: otherUser,
              lastMessage: message.timestamp,
              isRead: message.isRead
            };
          } else if (new Date(users[otherUser.username].lastMessage) < new Date(message.timestamp)) {
            users[otherUser.username].lastMessage = message.timestamp;
            users[otherUser.username].isRead = message.isRead;
          }
        });
        setConversations(Object.values(users));
      })
      .catch((error) => {
        console.error('Error fetching messages:', error.response ? error.response.data : error);
      });
  }, [token, username]);

  return (
    <div>
      <h1>Messages</h1>
      <ul className="message-list">
        {conversations.map((conversation) => (
          <li key={conversation.user.id} className={conversation.isRead ? 'read' : 'unread'}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/messages/conversation/${conversation.user.id}`);
              }}
            >
              {conversation.user.username}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
