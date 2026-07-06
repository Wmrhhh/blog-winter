import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

const ArticleCard = ({ article }) => {
  return (
    <div className="slide-up" style={{
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      <Link to={`/articles/${article.id}`} style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        textDecoration: 'none',
        color: 'inherit',
      }}>
        {/* 左侧内容 */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          {/* 分类标签 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '11px', fontWeight: 600,
              padding: '2px 10px', borderRadius: '20px',
            }}>
              {article.categoryName || '未分类'}
            </span>
          </div>

          {/* 标题 */}
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.title}
          </h3>

          {/* 摘要 */}
          <p style={{
            color: 'var(--ink-light)',
            fontSize: '14px',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.summary || article.content?.substring(0, 120) + '...'}
          </p>

          {/* 元信息 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--muted)',
            marginTop: 'auto',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiUser size={13} />
              {article.authorName || '匿名'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCalendar size={13} />
              {article.createdAt?.split(' ')[0]}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiEye size={13} />
              {article.viewCount || 0}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
