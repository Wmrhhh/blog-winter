package com.blog.dao;

import com.blog.model.Comment;
import com.blog.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 评论数据访问层
 */
public class CommentDao {

    /**
     * 根据文章ID获取评论列表（关联用户名）
     */
    public List<Comment> findByArticleId(int articleId) {
        String sql = "SELECT c.*, u.username " +
                "FROM comments c " +
                "LEFT JOIN users u ON c.user_id = u.id " +
                "WHERE c.article_id = ? " +
                "ORDER BY c.created_at DESC";
        List<Comment> comments = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, articleId);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                comments.add(mapResultSetToComment(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return comments;
    }

    /**
     * 新增评论
     */
    public boolean insert(Comment comment) {
        String sql = "INSERT INTO comments (article_id, user_id, content) VALUES (?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, comment.getArticleId());
            pstmt.setInt(2, comment.getUserId());
            pstmt.setString(3, comment.getContent());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 删除评论
     */
    public boolean delete(int id) {
        String sql = "DELETE FROM comments WHERE id = ?";
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
     * 将 ResultSet 映射为 Comment 对象
     */
    private Comment mapResultSetToComment(ResultSet rs) throws SQLException {
        Comment comment = new Comment();
        comment.setId(rs.getInt("id"));
        comment.setArticleId(rs.getInt("article_id"));
        comment.setUserId(rs.getInt("user_id"));
        comment.setContent(rs.getString("content"));
        comment.setCreatedAt(rs.getTimestamp("created_at"));
        comment.setUsername(rs.getString("username"));
        return comment;
    }
}
