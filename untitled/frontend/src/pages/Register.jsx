import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/user';
import { FiUser, FiLock, FiMail, FiUserPlus, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      alert('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const res = await registerApi(form);
      if (res.code === 200) {
        alert('注册成功，请登录');
        navigate('/login');
      } else {
        alert(res.message || '注册失败');
      }
    } catch (e) {
      alert('注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{
      minHeight: 'calc(100vh - 64px - 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #fce7f3 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #ec4899, #6366f1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <FiUserPlus size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
            创建账号
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
            注册一个新账号，开始你的博客之旅
          </p>
        </div>

        {/* Card with border */}
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 4px 24px rgba(236, 72, 153, 0.12)',
          padding: '32px 40px',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #ec4899, #6366f1, #8b5cf6)',
          }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 600,
                color: 'var(--ink-light)', marginBottom: '6px',
              }}>
                用户名
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                }} />
                <input
                  type="text"
                  placeholder="请输入用户名"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  style={{
                    width: '90%', padding: '12px 14px 12px 40px',
                    border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
                    fontSize: '15px', color: 'var(--ink)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 600,
                color: 'var(--ink-light)', marginBottom: '6px',
              }}>
                密码
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                }} />
                <input
                  type="password"
                  placeholder="请输入密码"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '90%', padding: '12px 14px 12px 40px',
                    border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
                    fontSize: '15px', color: 'var(--ink)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 600,
                color: 'var(--ink-light)', marginBottom: '6px',
              }}>
                邮箱 <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(可选)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                }} />
                <input
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '90%', padding: '12px 14px 12px 40px',
                    border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
                    fontSize: '15px', color: 'var(--ink)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '16px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
            }}>
              {loading ? (
                <span style={{ animation: 'pulse 1s infinite' }}>注册中...</span>
              ) : (
                <>注册 <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '20px', paddingTop: '20px',
            borderTop: '1px solid var(--rule)',
            fontSize: '14px', color: 'var(--muted)',
          }}>
            已有账号？{' '}
            <Link to="/login" style={{
              color: 'var(--primary)', fontWeight: 600,
              textDecoration: 'none',
            }}>
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
