import React, { useState, useContext } from 'react';
import axios from 'axios';
import './form.css';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    axios.post('http://localhost:8080/users/login', 
      { username, password },
      { headers })
      .then(response => {
        const { jwt, userId } = response.data;
        if (jwt && userId) {
          login(jwt, username, userId);
          navigate('/');
          alert('Login successful!');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch((error) => {
        console.error('There was an error logging in!', error);
        if (error.response && error.response.data && error.response.data.message === 'User is already logged in!') {
          setError('User is already logged in.');
        } else if (error.response && error.response.status === 500) {
          setError('User is already logged in.');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      });
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
