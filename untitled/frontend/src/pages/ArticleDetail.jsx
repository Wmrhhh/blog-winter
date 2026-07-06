import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '../api/article';
import { getCommentsByArticleId, addComment, deleteComment } from '../api/comment';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiCalendar, FiEye, FiTag, FiMessageCircle, FiSend, FiTrash2, FiArrowLeft, FiEdit3 } from 'react-icons/fi';

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articleRes, commentRes] = await Promise.all([
        getArticleById(id),
        getCommentsByArticleId(id),
      ]);
      if (articleRes.code === 200) setArticle(articleRes.data);
      if (commentRes.code === 200) setComments(commentRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment({ articleId: parseInt(id), content: newComment });
      if (res.code === 200) {
        setNewComment('');
        fetchData();
      }
    } catch (e) {
      alert('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('确定删除该评论？')) return;
    try {
      const res = await deleteComment(commentId);
      if (res.code === 200) fetchData();
    } catch (e) { alert('删除失败'); }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="skeleton" style={{ height: '40px', width: '80%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '32px' }} />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton" style={{ height: '16px', marginBottom: '12px', width: `${100 - i * 5}%` }} />
        ))}
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{
        maxWidth: '800px', margin: '0 auto', padding: '60px 24px', textAlign: 'center',
      }}>
        <p style={{ color: 'var(--muted)', fontSize: '16px' }}>文章不存在</p>
        <Link to="/" style={{ color: 'var(--primary)', marginTop: '16px', display: 'inline-block' }}>
          返回首页
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === article.userId || isAdmin());

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Back button */}
      <Link to="/articles" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: 'var(--muted)', fontSize: '14px', textDecoration: 'none',
        marginBottom: '20px', padding: '6px 12px', borderRadius: 'var(--radius-sm)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}
      >
        <FiArrowLeft size={14} /> 返回文章列表
      </Link>

      {/* Article */}
      <article style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}>
        {/* Category bar */}
        <div style={{
          padding: '10px 24px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <FiTag size={14} color="#fff" />
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
            {article.categoryName || '未分类'}
          </span>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Title */}
          <h1 style={{
            fontSize: '28px', fontWeight: 700, color: 'var(--ink)',
            lineHeight: 1.4, marginBottom: '16px',
          }}>
            {article.title}
          </h1>

          {/* Meta */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px',
            padding: '16px 0', marginBottom: '24px',
            borderBottom: '1px solid var(--rule)',
            fontSize: '14px', color: 'var(--muted)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>
                <FiUser size={14} />
              </span>
              {article.authorName || '匿名'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCalendar size={14} />
              {article.createdAt?.split(' ')[0]}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiEye size={14} />
              {article.viewCount || 0} 次阅读
            </span>
          </div>

          {/* Content */}
          <div style={{
            lineHeight: 1.9, fontSize: '16px', color: 'var(--ink-light)',
          }}>
            {article.content?.split('\n').map((paragraph, idx) => (
              <p key={idx} style={{
                marginBottom: paragraph.trim() ? '16px' : '8px',
                minHeight: paragraph.trim() ? 'auto' : '16px',
              }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Edit button for author */}
      {isAuthor && (
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Link to={`/dashboard`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg2)', color: 'var(--ink-light)',
            textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
          >
            <FiEdit3 size={14} /> 编辑文章
          </Link>
        </div>
      )}

      {/* Comments */}
      <div style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-lg)',
        marginTop: '24px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--rule)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <FiMessageCircle size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>
            评论 ({comments.length})
          </h2>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Comment form */}
          {user ? (
            <form onSubmit={handleSubmitComment} style={{
              marginBottom: '24px', paddingBottom: '24px',
              borderBottom: comments.length > 0 ? '1px solid var(--rule)' : 'none',
            }}>
              <div style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: isAdmin() ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #6366f1, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>
                  <FiUser size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    placeholder="写下你的评论..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px',
                      border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
                      fontSize: '14px', lineHeight: 1.6, resize: 'vertical',
                      minHeight: '80px',
                      background: 'var(--bg)',
                    }}
                    rows={3}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button type="submit" disabled={submitting || !newComment.trim()} style={{
                      padding: '8px 20px',
                      background: !newComment.trim() ? 'var(--muted)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px', fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: !newComment.trim() ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.3)',
                    }}>
                      <FiSend size={14} />
                      {submitting ? '发送中...' : '发表评论'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div style={{
              textAlign: 'center', padding: '20px',
              background: 'var(--bg2)', borderRadius: 'var(--radius-sm)',
              marginBottom: '24px', paddingBottom: comments.length > 0 ? '24px' : '0',
              borderBottom: comments.length > 0 ? '1px solid var(--rule)' : 'none',
              color: 'var(--muted)', fontSize: '14px',
            }}>
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                登录
              </Link>
              {' '}后即可发表评论
            </div>
          )}

          {/* Comments list */}
          {comments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div style={{
                    display: 'flex', gap: '12px', padding: '16px',
                    background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'][index % 5]}, ${['#8b5cf6', '#6366f1', '#ef4444', '#10b981', '#3b82f6'][index % 5]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', flexShrink: 0,
                    }}>
                      <FiUser size={12} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>
                          {comment.username || '匿名'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            {comment.createdAt?.split(' ')[0]}
                          </span>
                          {user && (user.id === comment.userId || isAdmin()) && (
                            <button onClick={() => handleDeleteComment(comment.id)} style={{
                              background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
                              border: 'none', padding: '4px 8px', borderRadius: '6px',
                              fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px',
                            }}>
                              <FiTrash2 size={12} /> 删除
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: '14px' }}>
              暂无评论，快来抢沙发吧~
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
