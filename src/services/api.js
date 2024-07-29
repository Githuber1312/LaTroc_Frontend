import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchPosts = () => {
  return axios.get(`${API_URL}/posts`);
};

export const fetchPostById = (id) => {
  return axios.get(`${API_URL}/posts/${id}`);
};

export const fetchCategories = () => {
  return axios.get('http://localhost:8080/categories');
};

export const searchPosts = (query) => {
  return axios.get(`${API_URL}/posts/search`, {
    params: { query }
  });
};

export const fetchPostsByCategory = (categoryId) => {
  return axios.get(`${API_URL}/posts/category/${categoryId}`);
};