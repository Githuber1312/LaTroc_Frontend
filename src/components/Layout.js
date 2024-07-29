import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import AuthContext from '../context/AuthContext';
import { fetchCategories } from '../services/api';
import './Layout.css';

function Layout({ children }) {
  const { token } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch categories', error);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value === '') {
      navigate(`/`);
    } else {
      navigate(`/category/${e.target.value}`);
    }
  };

  return (
    <div>
      <header className="layout-header">
        <div className="nav-left">
          <Link to="/" className="home-button">Home</Link>
          {token && <Link to="/messages" className="home-button">Messages</Link> }
          {token && <Link to="/posts/create" className="home-button">Create Post</Link>}
          <select className="category-dropdown home-button" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="nav-center">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for posts..."
            />
            <button type="submit" className="home-button">Search</button>
          </form>
        </div>
        <div className="nav-right">
          <LoginButton />
          {!token && <Link to="/register" className="register-button">Register</Link>}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
