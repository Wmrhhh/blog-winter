import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiEye } from 'react-icons/fi';

const ArticleCard = ({ article }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      to={`/articles/${article.id}`}
      style={{
        display: 'flex',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--card)',
        border: hovered
          ? '1px solid rgba(99, 102, 241, 0.4)'
          : '1px solid rgba(99, 102, 241, 0.18)',
        boxShadow: hovered
          ? '0 8px 24px rgba(99, 102, 241, 0.15), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left gradient accent bar */}
      <div style={{
        width: '4px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #6366f1, #ec4899)',
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.3s ease',
      }} />

      <div style={{ flex: 1, padding: '20px 20px 20px 16px' }}>
        {/* Category tag */}
        <span style={{
          display: 'inline-block',
          padding: '3px 12px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.08))',
          color: 'var(--primary)',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '10px',
        }}>
          {article.categoryName || '未分类'}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: '17px', fontWeight: 700, color: 'var(--ink)',
          marginBottom: '8px', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.title}
        </h3>

        {/* Summary */}
        <p style={{
          fontSize: '14px', color: 'var(--ink-light)',
          lineHeight: 1.6, marginBottom: '12px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.summary || article.content?.substring(0, 100) + '...'}
        </p>

        {/* Meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          fontSize: '13px', color: 'var(--muted)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiUser size={13} /> {article.authorName || '匿名'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiCalendar size={13} /> {article.createdAt?.split(' ')[0]}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiEye size={13} /> {article.viewCount || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
