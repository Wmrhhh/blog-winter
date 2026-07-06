import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api/article';
import { getCategories } from '../api/category';
import ArticleCard from '../components/ArticleCard';
import { FiBookOpen, FiFolder, FiTrendingUp, FiArrowRight, FiZap } from 'react-icons/fi';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articleRes, categoryRes] = await Promise.all([
        getArticles(),
        getCategories(),
      ]);
      if (articleRes.code === 200) setArticles(articleRes.data || []);
      if (categoryRes.code === 200) setCategories(categoryRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '140px' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius)' }} />
      </div>
    );
  }

  const totalArticles = articles.length;
  const totalCategories = categories.length;

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }} />
        <div style={{
          maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px',
        }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.5px' }}>
              欢迎来到博客空间
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', maxWidth: '500px' }}>
              记录技术成长，分享学习心得，在这里发现更多精彩内容
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-sm)', padding: '16px 24px', textAlign: 'center', minWidth: '100px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#fff', marginBottom: '4px' }}>
                <FiFileText size={16} /> 文章
              </div>
              <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>{totalArticles}</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-sm)', padding: '16px 24px', textAlign: 'center', minWidth: '100px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#fff', marginBottom: '4px' }}>
                <FiFolder size={16} /> 分类
              </div>
              <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>{totalCategories}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Background Layer */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Floating orbs — enhanced contrast */}
        <div style={{
          position: 'absolute', top: '-120px', left: '-120px', width: '550px', height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)',
          animation: 'floatOrb1 18s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '180px', right: '-100px', width: '450px', height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.13) 0%, rgba(236,72,153,0.03) 50%, transparent 70%)',
          animation: 'floatOrb2 22s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', bottom: '60px', left: '25%', width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.03) 50%, transparent 70%)',
          animation: 'floatOrb3 20s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '32px 24px',
          display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px',
          position: 'relative', zIndex: 1,
        }}>
        {/* Articles */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
              <FiTrendingUp size={20} style={{ color: 'var(--primary)' }} />
              最新文章
            </h2>
            <Link to="/articles" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--primary)', fontSize: '14px', fontWeight: 500,
            }}>
              查看全部 <FiArrowRight size={14} />
            </Link>
          </div>

          {articles.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: 'var(--card)', borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
            }}>
              <FiBookOpen size={48} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
              <p style={{ color: 'var(--muted)', fontSize: '15px' }}>暂无文章，快来发布第一篇吧</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {articles.map((article, index) => (
                <div key={article.id} className="slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Categories */}
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <FiFolder size={16} color="#fff" />
              <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>文章分类</h3>
            </div>
            <div style={{ padding: '8px' }}>
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  to={`/articles?categoryId=${cat.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    color: 'var(--ink)', textDecoration: 'none',
                    fontSize: '14px', fontWeight: 500,
                    transition: 'all 0.2s',
                    animationDelay: `${index * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg2)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--ink)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#8b5cf6'][index % 6],
                      display: 'inline-block',
                    }} />
                    {cat.name}
                  </span>
                  <span style={{
                    background: 'var(--bg2)', color: 'var(--muted)',
                    fontSize: '12px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600,
                  }}>
                    {cat.articleCount || 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)', padding: '20px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: 'var(--ink)' }}>
              <FiZap size={14} style={{ color: 'var(--warning)', marginRight: '6px' }} />
              快速开始
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/articles" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg2)', color: 'var(--ink)', textDecoration: 'none',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--ink)'; }}
              >
                <FiBookOpen size={14} /> 浏览所有文章
              </Link>
              <Link to="/register" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg2)', color: 'var(--ink)', textDecoration: 'none',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--ink)'; }}
              >
                <FiZap size={14} /> 注册账号发布文章
              </Link>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
};

const FiFileText = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default Home;
