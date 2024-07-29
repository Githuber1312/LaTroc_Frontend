import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LocalUser.css';

function LocalUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/users/${id}`)
      .then(response => {
        console.log("Fetched user:", response.data);
        setUser(response.data);
      })
      .catch(error => console.error('Error fetching user:', error.response ? error.response.data : error));
  }, [id]);

  if (!user) return <div>Loading...</div>;

  const handleSendMessage = () => {
    console.log("Navigating to conversation with user ID:", user.id);
    if (user && user.userId) {
      navigate(`/messages/conversation/${user.userId}`);
    } else {
      console.error('User ID is undefined');
    }
  };

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleSendMessage}>Send Message</button>
      <h2>Posts</h2>
      <ul className="no-bullets">
        {user.posts.map(post => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocalUser;
