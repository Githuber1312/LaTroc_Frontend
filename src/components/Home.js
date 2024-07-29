import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchPosts, searchPosts, fetchPostsByCategory } from '../services/api';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { categoryId } = useParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('query');
    setQuery(queryParam);

    if (categoryId) {
      fetchPostsByCategory(categoryId)
        .then(response => {
          setPosts(response.data);
        })
        .catch(err => {
          setError('Failed to fetch posts');
          console.error(err);
        });
    } else if (queryParam) {
      searchPosts(queryParam)
        .then(response => {
          setPosts(response.data);
        })
        .catch(err => {
          setError('Failed to fetch posts');
          console.error(err);
        });
    } else {
      fetchPosts()
        .then(response => {
          setPosts(response.data);
        })
        .catch(err => {
          setError('Failed to fetch posts');
          console.error(err);
        });
    }
  }, [location.search, categoryId]);

  return (
    <div>
      <h1>Marketplace Home</h1>
      {error ? <p>{error}</p> : null}
      {query && <p>Showing results for "{query}"</p>}
      <div className="post-list">
        {posts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-link">
            <div className="post-item">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
