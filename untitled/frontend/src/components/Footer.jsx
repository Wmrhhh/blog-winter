import React from 'react';
import { FiHeart, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#94a3b8',
      padding: '40px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiHeart size={14} style={{ color: '#ec4899' }} />
          <span style={{ fontSize: '14px' }}>
            React + Servlet + MySQL 课程设计
          </span>
        </div>
        <div style={{
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <span>2026 个人博客系统</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
