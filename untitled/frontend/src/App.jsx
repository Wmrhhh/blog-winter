import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ArticleEditor from './pages/ArticleEditor';

// 需要登录才能访问的路由
const PrivateRoute = ({ children, requireAdmin }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1, background: '#f5f5f5' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/write" element={
                <PrivateRoute><ArticleEditor /></PrivateRoute>
              }/>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
