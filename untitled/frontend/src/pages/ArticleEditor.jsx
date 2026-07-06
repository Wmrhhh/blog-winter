import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, updateArticle } from '../api/article';
import { getCategories } from '../api/category';
import { useAuth } from '../context/AuthContext';
import { FiEdit3, FiTag, FiType, FiFileText, FiSave, FiX, FiCheck } from 'react-icons/fi';

const ArticleEditor = ({ editArticle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    status: 'published',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const isEdit = editArticle && editArticle.id;

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      setForm({
        title: editArticle.title || '',
        content: editArticle.content || '',
        categoryId: editArticle.categoryId || '',
        status: editArticle.status || 'published',
      });
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.code === 200) setCategories(res.data || []);
    } catch (e) { console.error(e); }
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, content: val });
    setCharCount(val.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('标题和内容不能为空');
      return;
    }
    if (!form.categoryId) {
      alert('请选择分类');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        categoryId: parseInt(form.categoryId),
      };

      let res;
      if (isEdit) {
        res = await updateArticle(editArticle.id, data);
      } else {
        res = await createArticle(data);
      }

      if (res.code === 200) {
        alert(isEdit ? '修改成功' : '发布成功');
        navigate(isEdit ? '/dashboard' : '/');
      } else {
        alert(res.message || '操作失败');
      }
    } catch (e) {
      alert('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '860px', margin: '32px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiEdit3 size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
              {isEdit ? '编辑文章' : '写文章'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {isEdit ? '修改文章内容和信息' : '分享你的想法和知识'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiType size={14} style={{ color: 'var(--primary)' }} />
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-light)' }}>文章标题</label>
            </div>
            <input
              type="text"
              placeholder="请输入一个引人注目的标题..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{
                width: '100%', padding: '14px 16px',
                border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
                fontSize: '18px', fontWeight: 600, color: 'var(--ink)',
                background: 'var(--bg)',
              }}
            />
          </div>

          {/* Category Select */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiTag size={14} style={{ color: 'var(--primary)' }} />
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-light)' }}>文章分类</label>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, categoryId: cat.id })}
                  style={{
                    padding: '8px 16px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: 500,
                    border: '1px solid',
                    borderColor: String(form.categoryId) === String(cat.id) ? 'var(--primary)' : 'var(--rule)',
                    background: String(form.categoryId) === String(cat.id) ? 'rgba(99,102,241,0.1)' : 'var(--bg)',
                    color: String(form.categoryId) === String(cat.id) ? 'var(--primary)' : 'var(--ink-light)',
                  }}
                >
                  {form.categoryId === cat.id && <FiCheck size={12} style={{ marginRight: '4px' }} />}
                  {cat.name}
                </button>
              ))}
              {categories.length === 0 && (
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>暂无分类</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiFileText size={14} style={{ color: 'var(--primary)' }} />
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-light)' }}>文章内容</label>
              </div>
              <span style={{
                fontSize: '12px', color: charCount > 0 ? 'var(--muted)' : 'transparent',
              }}>
                {charCount} 字
              </span>
            </div>
            <textarea
              placeholder="开始写作吧...&#10;&#10;支持多段落，每行一个段落。"
              value={form.content}
              onChange={handleContentChange}
              style={{
                width: '100%', padding: '16px',
                border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
                fontSize: '15px', lineHeight: 1.8,
                resize: 'vertical', minHeight: '320px',
                background: 'var(--bg)',
                fontFamily: 'var(--font)',
              }}
              rows={15}
            />
          </div>

          {/* Actions */}
          <div style={{
            padding: '16px 24px',
            background: 'var(--bg2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--rule)',
          }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: '10px 20px',
                background: 'var(--card)', color: 'var(--ink-light)',
                border: '1px solid var(--rule)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <FiX size={14} /> 取消
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              <FiSave size={14} />
              {loading ? '提交中...' : (isEdit ? '保存修改' : '发布文章')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
