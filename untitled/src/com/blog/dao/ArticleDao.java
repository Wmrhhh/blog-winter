package com.blog.dao;

import com.blog.model.Article;
import com.blog.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 文章数据访问层
 */
public class ArticleDao {

    /**
     * 获取所有已发布文章（关联作者和分类）
     */
    public List<Article> findAllPublished() {
        String sql = "SELECT a.*, u.username as author_name, c.name as category_name " +
                "FROM articles a " +
                "LEFT JOIN users u ON a.user_id = u.id " +
                "LEFT JOIN categories c ON a.category_id = c.id " +
                "WHERE a.status = 'published' " +
                "ORDER BY a.created_at DESC";
        List<Article> articles = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                articles.add(mapResultSetToArticle(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return articles;
    }

    /**
     * 根据ID查找文章
     */
    public Article findById(int id) {
        String sql = "SELECT a.*, u.username as author_name, c.name as category_name " +
                "FROM articles a " +
                "LEFT JOIN users u ON a.user_id = u.id " +
                "LEFT JOIN categories c ON a.category_id = c.id " +
                "WHERE a.id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToArticle(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return null;
    }

    /**
     * 根据用户ID获取文章列表
     */
    public List<Article> findByUserId(int userId) {
        String sql = "SELECT a.*, u.username as author_name, c.name as category_name " +
                "FROM articles a " +
                "LEFT JOIN users u ON a.user_id = u.id " +
                "LEFT JOIN categories c ON a.category_id = c.id " +
                "WHERE a.user_id = ? " +
                "ORDER BY a.created_at DESC";
        List<Article> articles = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                articles.add(mapResultSetToArticle(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return articles;
    }

    /**
     * 根据分类ID获取文章列表
     */
    public List<Article> findByCategoryId(int categoryId) {
        String sql = "SELECT a.*, u.username as author_name, c.name as category_name " +
                "FROM articles a " +
                "LEFT JOIN users u ON a.user_id = u.id " +
                "LEFT JOIN categories c ON a.category_id = c.id " +
                "WHERE a.category_id = ? AND a.status = 'published' " +
                "ORDER BY a.created_at DESC";
        List<Article> articles = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, categoryId);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                articles.add(mapResultSetToArticle(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return articles;
    }

    /**
     * 新增文章
     */
    public boolean insert(Article article) {
        String sql = "INSERT INTO articles (title, summary, content, cover_image, user_id, category_id, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, article.getTitle());
            pstmt.setString(2, article.getSummary());
            pstmt.setString(3, article.getContent());
            pstmt.setString(4, article.getCoverImage());
            pstmt.setInt(5, article.getUserId());
            pstmt.setInt(6, article.getCategoryId());
            pstmt.setString(7, article.getStatus());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 更新文章
     */
    public boolean update(Article article) {
        String sql = "UPDATE articles SET title=?, summary=?, content=?, cover_image=?, category_id=?, status=? " +
                "WHERE id=?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, article.getTitle());
            pstmt.setString(2, article.getSummary());
            pstmt.setString(3, article.getContent());
            pstmt.setString(4, article.getCoverImage());
            pstmt.setInt(5, article.getCategoryId());
            pstmt.setString(6, article.getStatus());
            pstmt.setInt(7, article.getId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 删除文章
     */
    public boolean delete(int id) {
        String sql = "DELETE FROM articles WHERE id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 增加阅读量
     */
    public boolean incrementViewCount(int id) {
        String sql = "UPDATE articles SET view_count = view_count + 1 WHERE id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 统计文章总数
     */
    public int count() {
        String sql = "SELECT COUNT(*) FROM articles WHERE status = 'published'";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return 0;
    }

    /**
     * 将 ResultSet 映射为 Article 对象
     */
    private Article mapResultSetToArticle(ResultSet rs) throws SQLException {
        Article article = new Article();
        article.setId(rs.getInt("id"));
        article.setTitle(rs.getString("title"));
        article.setSummary(rs.getString("summary"));
        article.setContent(rs.getString("content"));
        article.setCoverImage(rs.getString("cover_image"));
        article.setUserId(rs.getInt("user_id"));
        article.setCategoryId(rs.getInt("category_id"));
        article.setViewCount(rs.getInt("view_count"));
        article.setStatus(rs.getString("status"));
        article.setCreatedAt(rs.getTimestamp("created_at"));
        article.setUpdatedAt(rs.getTimestamp("updated_at"));
        article.setAuthorName(rs.getString("author_name"));
        article.setCategoryName(rs.getString("category_name"));
        return article;
    }
}
