import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/categories', {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      setCategories(response.data);
    })
    .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.length > 200) {
      setError('Title cannot exceed 200 characters.');
      return;
    }
    if (description.length > 4000) {
      setError('Description cannot exceed 4000 characters.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('categoryId', categoryId);
    formData.append('image', image);

    axios.post('http://localhost:8080/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${document.cookie.split('=')[1]}`,
      },
    })
    .then(response => {
      navigate(`/post/${response.data.id}`);
    })
    .catch(error => {
      console.error('There was an error creating the post!', error);
      setError('Failed to create the post.');
    });
  };

  return (
    <div className="create-post-container">
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {title.length > 200 && <p className="error-message">Title cannot exceed 200 characters.</p>}
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {description.length > 4000 && <p className="error-message">Description cannot exceed 4000 characters.</p>}
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreatePost;
