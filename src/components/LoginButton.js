import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginButton.css';

function LoginButton() {
  const { token, username, userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    token ? (
      <div className="login-container">
        <span className="username">
          Hi, <Link to={`/users/${userId}`} className="profile-link">{username}</Link>
        </span>
        <button className="login-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    ) : (
      <Link to="/login" className="login-button">
        Login
      </Link>
    )
  );
}

export default LoginButton;
