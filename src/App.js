import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Post from './components/Post';
import Login from './components/Login';
import Register from './components/Register';
import LocalUser from './components/LocalUser';
import SendMessage from './components/SendMessage';
import CreatePost from './components/CreatePost';
import MessageList from './components/MessageList';
import Conversation from './components/Conversation';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users/:id" element={<LocalUser />} />
            <Route path="/send-message/:username?" element={<SendMessage />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/messages" element={<MessageList />} />
            <Route path="/messages/conversation/:id" element={<Conversation />} />
            <Route path="/search" element={<Home />} />
            <Route path="/category/:categoryId" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
