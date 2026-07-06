import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getArticles } from '../api/article';
import { getCategories as getCategoriesApi } from '../api/category';
import ArticleCard from '../components/ArticleCard';
import { FiFileText, FiFilter } from 'react-icons/fi';

const ArticleList = () => {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [categoryId]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = categoryId ? { categoryId } : {};
      const res = await getArticles(params);
      if (res.code === 200) {
        setArticles(res.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();
      if (res.code === 200) setCategories(res.data || []);
    } catch (e) { console.error(e); }
  };

  const currentCategory = categories.find(c => c.id === parseInt(categoryId));

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="skeleton" style={{ height: '32px', width: '200px', marginBottom: '20px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '140px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 64px - 60px)' }}>
      {/* Dynamic Background */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-100px', width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
        animation: 'floatOrb1 18s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '300px', left: '-80px', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
        animation: 'floatOrb2 22s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '80px', right: '20%', width: '350px', height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)',
        animation: 'floatOrb3 20s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '24px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px',
          }}>
            <FiFileText size={24} style={{ color: 'var(--primary)' }} />
            {currentCategory ? `分类：${currentCategory.name}` : '所有文章'}
          </h1>
          {currentCategory && (
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
              共 {articles.length} 篇文章
            </p>
          )}
        </div>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px',
            alignItems: 'center',
          }}>
            <FiFilter size={14} style={{ color: 'var(--muted)' }} />
            <a
              href="/articles"
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
                background: !categoryId ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg2)',
                color: !categoryId ? '#fff' : 'var(--ink-light)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              全部
            </a>
            {categories.map(cat => (
              <a
                key={cat.id}
                href={`/articles?categoryId=${cat.id}`}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
                  background: categoryId === String(cat.id) ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg2)',
                  color: categoryId === String(cat.id) ? '#fff' : 'var(--ink-light)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                {cat.name} ({cat.articleCount || 0})
              </a>
            ))}
          </div>
        )}

        {/* Article list */}
        {articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: 'var(--card)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
          }}>
            <FiFileText size={48} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--muted)', fontSize: '15px' }}>该分类下暂无文章</p>
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
    </div>
  );
};

export default ArticleList;
