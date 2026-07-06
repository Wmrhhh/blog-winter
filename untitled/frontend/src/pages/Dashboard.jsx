import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserList, deleteUser } from '../api/user';
import { getCategories, createCategory, deleteCategory } from '../api/category';
import { deleteArticle } from '../api/article';
import { FiFileText, FiUsers, FiFolder, FiEdit3, FiTrash2, FiPlus, FiEye, FiCalendar, FiShield, FiBarChart2 } from 'react-icons/fi';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
      fetchCategories();
    }
    fetchMyArticles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUserList();
      if (res.code === 200) setUsers(res.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.code === 200) setCategories(res.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchMyArticles = async () => {
    try {
      const { getArticles } = await import('../api/article');
      const res = await getArticles({ userId: user?.id });
      if (res.code === 200) setArticles(res.data || []);
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('确定删除该用户？此操作不可撤销。')) return;
    try {
      const res = await deleteUser(id);
      if (res.code === 200) {
        fetchUsers();
      }
    } catch (e) { alert('删除失败'); }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('确定删除该文章？此操作不可撤销。')) return;
    try {
      const res = await deleteArticle(id);
      if (res.code === 200) {
        fetchMyArticles();
      }
    } catch (e) { alert('删除失败'); }
  };

  const handleAddCategory = async () => {
    const name = prompt('请输入分类名称');
    if (!name || !name.trim()) return;
    try {
      const res = await createCategory({ name: name.trim(), description: '' });
      if (res.code === 200) {
        fetchCategories();
      } else {
        alert(res.message || '添加失败');
      }
    } catch (e) { alert('添加失败'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('确定删除该分类？此操作不可撤销。')) return;
    try {
      const res = await deleteCategory(id);
      if (res.code === 200) {
        fetchCategories();
      }
    } catch (e) { alert('删除失败'); }
  };

  const tabs = [
    { key: 'articles', label: '我的文章', icon: FiEdit3, count: articles.length },
    ...(isAdmin() ? [
      { key: 'users', label: '用户管理', icon: FiUsers, count: users.length },
      { key: 'categories', label: '分类管理', icon: FiFolder, count: categories.length },
    ] : []),
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '24px', fontWeight: 700, color: 'var(--ink)',
          }}>
            <FiShield size={24} style={{ color: 'var(--primary)' }} />
            {isAdmin() ? '管理后台' : '个人中心'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
            欢迎回来，{user?.username}
          </p>
        </div>

        {isAdmin() && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              padding: '12px 20px', borderRadius: 'var(--radius-sm)',
              background: 'var(--card)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <FiBarChart2 size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '14px', color: 'var(--ink-light)' }}>
                <strong style={{ color: 'var(--ink)' }}>{users.length}</strong> 用户
              </span>
            </div>
            <div style={{
              padding: '12px 20px', borderRadius: 'var(--radius-sm)',
              background: 'var(--card)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <FiFileText size={16} style={{ color: 'var(--secondary)' }} />
              <span style={{ fontSize: '14px', color: 'var(--ink-light)' }}>
                <strong style={{ color: 'var(--ink)' }}>{articles.length}</strong> 文章
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px',
        background: 'var(--bg2)', padding: '4px',
        borderRadius: 'var(--radius-sm)', marginBottom: '24px',
        width: 'fit-content',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--ink)' : 'var(--muted)',
              fontSize: '14px', fontWeight: activeTab === tab.key ? 600 : 400,
              boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: activeTab === tab.key ? 'var(--primary)' : 'var(--rule)',
                color: activeTab === tab.key ? '#fff' : 'var(--muted)',
                fontSize: '11px', fontWeight: 700,
                padding: '1px 7px', borderRadius: '10px',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="slide-up">
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--rule)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                我的文章 ({articles.length})
              </span>
              <Link to="/write" style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '6px 14px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: '13px', fontWeight: 500,
                textDecoration: 'none',
              }}>
                <FiPlus size={14} /> 写文章
              </Link>
            </div>
            {articles.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <FiFileText size={40} style={{ color: 'var(--muted)', marginBottom: '12px' }} />
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>还没有写过文章</p>
                <Link to="/write" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  marginTop: '12px', color: 'var(--primary)', fontSize: '14px', fontWeight: 500,
                  textDecoration: 'none',
                }}>
                  <FiPlus size={14} /> 开始写第一篇
                </Link>
              </div>
            ) : (
              <div>
                {articles.map(article => (
                  <div key={article.id} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--rule)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', flexShrink: 0,
                    }}>
                      <FiFileText size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, fontSize: '15px', color: 'var(--ink)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        <Link to={`/articles/${article.id}`} style={{
                          color: 'inherit', textDecoration: 'none',
                        }}>
                          {article.title}
                        </Link>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <FiFolder size={11} /> {article.categoryName || '未分类'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <FiEye size={11} /> {article.viewCount || 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <FiCalendar size={11} /> {article.createdAt?.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteArticle(article.id)} style={{
                      background: 'rgba(239,68,68,0.08)', color: 'var(--danger)',
                      border: 'none', padding: '8px 12px', borderRadius: '8px',
                      fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                    >
                      <FiTrash2 size={14} /> 删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && isAdmin() && (
        <div className="slide-up">
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--rule)',
              fontWeight: 600, fontSize: '15px',
            }}>
              用户列表 ({users.length})
            </div>
            {users.map(u => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px',
                borderBottom: '1px solid var(--rule)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: u.role === 'admin'
                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(135deg, #6366f1, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>
                  {u.role === 'admin' ? <FiShield size={16} /> : <FiUsers size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>
                    {u.username}
                    {u.id === user?.id && (
                      <span style={{
                        marginLeft: '8px', fontSize: '11px', padding: '1px 8px',
                        background: 'rgba(99,102,241,0.1)', color: 'var(--primary)',
                        borderRadius: '10px', fontWeight: 600,
                      }}>我自己</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--muted)' }}>
                    <span className={u.role === 'admin' ? 'badge badge-danger' : 'badge badge-primary'}>
                      {u.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <FiCalendar size={11} /> {u.createdAt?.split(' ')[0]}
                    </span>
                  </div>
                </div>
                {u.id !== user?.id && (
                  <button onClick={() => handleDeleteUser(u.id)} style={{
                    background: 'rgba(239,68,68,0.08)', color: 'var(--danger)',
                    border: 'none', padding: '8px 12px', borderRadius: '8px',
                    fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px',
                    transition: 'all 0.2s', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  >
                    <FiTrash2 size={14} /> 删除
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && isAdmin() && (
        <div className="slide-up">
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--rule)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                分类管理 ({categories.length})
              </span>
              <button onClick={handleAddCategory} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '6px 14px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff', fontSize: '13px', fontWeight: 500, border: 'none',
              }}>
                <FiPlus size={14} /> 新增分类
              </button>
            </div>
            {categories.map(cat => (
              <div key={cat.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px',
                borderBottom: '1px solid var(--rule)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#8b5cf6'][cat.id % 6]
                    ? `linear-gradient(135deg, ${['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#8b5cf6'][cat.id % 6]}, ${['#8b5cf6', '#6366f1', '#ef4444', '#10b981', '#3b82f6', '#ec4899'][cat.id % 6]})`
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>
                  <FiFolder size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                    {cat.articleCount || 0} 篇文章
                  </div>
                </div>
                <a
                  href={`/articles?categoryId=${cat.id}`}
                  style={{
                    padding: '6px 12px', borderRadius: '6px',
                    background: 'rgba(99,102,241,0.08)', color: 'var(--primary)',
                    fontSize: '12px', textDecoration: 'none', fontWeight: 500,
                  }}
                >
                  查看
                </a>
                <button onClick={() => handleDeleteCategory(cat.id)} style={{
                  background: 'rgba(239,68,68,0.08)', color: 'var(--danger)',
                  border: 'none', padding: '8px 12px', borderRadius: '8px',
                  fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                >
                  <FiTrash2 size={14} /> 删除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
