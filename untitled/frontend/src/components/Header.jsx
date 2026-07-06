import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiFileText, FiEdit3, FiUser, FiLogOut, FiShield, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: isActive(path) ? '#818cf8' : '#cbd5e1',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: isActive(path) ? 600 : 400,
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    background: isActive(path) ? 'rgba(99,102,241,0.1)' : 'transparent',
  });

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px', fontWeight: 700,
          }}>B</div>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            博客空间
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          <Link to="/" style={navLinkStyle('/')}>
            <FiHome size={16} /> 首页
          </Link>
          <Link to="/articles" style={navLinkStyle('/articles')}>
            <FiFileText size={16} /> 文章
          </Link>

          {user && (
            <>
              <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                <FiEdit3 size={16} /> 我的文章
              </Link>
              <Link to="/write" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                padding: '8px 16px', borderRadius: '8px',
              }}>
                <FiEdit3 size={14} /> 写文章
              </Link>
              {isAdmin() && (
                <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                  <FiShield size={16} /> 管理
                </Link>
              )}
            </>
          )}

          {!user ? (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              <Link to="/login" style={{
                color: '#cbd5e1', textDecoration: 'none', fontSize: '14px',
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155',
              }}>登录</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                padding: '8px 16px', borderRadius: '8px',
              }}>注册</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.08)',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: isAdmin() ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #6366f1, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px',
                }}>
                  {isAdmin() ? <FiShield size={12} /> : <FiUser size={12} />}
                </div>
                <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{user.username}</span>
              </div>
              <button onClick={handleLogout} style={{
                background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
                border: 'none', padding: '8px 12px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px',
              }}>
                <FiLogOut size={14} />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none', color: '#fff',
          fontSize: '24px', padding: '4px',
        }} className="mobile-menu-btn">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
