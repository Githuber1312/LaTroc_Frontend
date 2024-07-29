import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get('token') || null);
  const [username, setUsername] = useState(Cookies.get('username') || '');
  const [userId, setUserId] = useState(Cookies.get('userId') || null);

  useEffect(() => {
    console.log('AuthProvider useEffect:', { token, username, userId });
    if (token) {
      Cookies.set('token', token);
      Cookies.set('username', username);
      Cookies.set('userId', userId);
    } else {
      Cookies.remove('token');
      Cookies.remove('username');
      Cookies.remove('userId');
    }
  }, [token, username, userId]);

  const login = (newToken, newUsername, newUserId) => {
    console.log('Logging in:', newToken, newUsername, newUserId);
    setToken(newToken);
    setUsername(newUsername);
    setUserId(newUserId);
  };

  const logout = () => {
    console.log('Logging out');
    setToken(null);
    setUsername('');
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
