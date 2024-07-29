import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Post.css';

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log('Post data:', response.data);
      setPost(response.data);
    })
    .catch(error => console.error('Error fetching post:', error.response ? error.response.data : error));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  const handleDelete = () => {
    axios.delete(`http://localhost:8080/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(() => {
      navigate('/');
    })
    .catch(error => {
      console.error('Error deleting post:', error.response ? error.response.data : error);
    });
  };

  const imageUrl = `http://localhost:8080/${post.imageUrl}`;

  return (
    <div className="post-container">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <p>Price: ${post.price}</p>
      {post.imageUrl && (
        <img src={imageUrl} alt={post.title} className="post-image" />
      )}
      <p>Posted by: <Link to={`/users/${post.userId}`}>{post.username}</Link></p>
      {post.username === username && (
        <button onClick={handleDelete} className="delete-button">Delete Post</button>
      )}
    </div>
  );
}

export default Post;
