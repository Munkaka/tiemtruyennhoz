
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import AuthorDashboard from './pages/AuthorDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/author" element={<AuthorDashboard />} />
          
          {/* Placeholders */}
          <Route path="/library" element={<div className="p-8 text-center text-gray-500">Thư viện đang phát triển...</div>} />
          <Route path="/history" element={<div className="p-8 text-center text-gray-500">Lịch sử đọc đang phát triển...</div>} />
          <Route path="/genres" element={<div className="p-8 text-center text-gray-500">Danh sách thể loại đang phát triển...</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
