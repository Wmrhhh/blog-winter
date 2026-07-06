package com.blog.dao;

import com.blog.model.Category;
import com.blog.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 分类数据访问层
 */
public class CategoryDao {

    /**
     * 获取所有分类（带文章数量统计）
     */
    public List<Category> findAll() {
        String sql = "SELECT c.*, COUNT(a.id) as article_count " +
                "FROM categories c " +
                "LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published' " +
                "GROUP BY c.id, c.name, c.description, c.sort_order, c.created_at " +
                "ORDER BY c.sort_order DESC";
        List<Category> categories = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                categories.add(mapResultSetToCategory(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return categories;
    }

    /**
     * 根据ID查找分类
     */
    public Category findById(int id) {
        String sql = "SELECT * FROM categories WHERE id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToCategory(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return null;
    }

    /**
     * 新增分类
     */
    public boolean insert(Category category) {
        String sql = "INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, category.getName());
            pstmt.setString(2, category.getDescription());
            pstmt.setInt(3, category.getSortOrder());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 更新分类
     */
    public boolean update(Category category) {
        String sql = "UPDATE categories SET name=?, description=?, sort_order=? WHERE id=?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, category.getName());
            pstmt.setString(2, category.getDescription());
            pstmt.setInt(3, category.getSortOrder());
            pstmt.setInt(4, category.getId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(pstmt, conn);
        }
        return false;
    }

    /**
     * 删除分类
     */
    public boolean delete(int id) {
        String sql = "DELETE FROM categories WHERE id = ?";
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
     * 将 ResultSet 映射为 Category 对象
     */
    private Category mapResultSetToCategory(ResultSet rs) throws SQLException {
        Category category = new Category();
        category.setId(rs.getInt("id"));
        category.setName(rs.getString("name"));
        category.setDescription(rs.getString("description"));
        category.setSortOrder(rs.getInt("sort_order"));
        category.setCreatedAt(rs.getTimestamp("created_at"));
        try {
            category.setArticleCount(rs.getInt("article_count"));
        } catch (SQLException e) {
            // 某些查询可能没有 article_count 字段
            category.setArticleCount(0);
        }
        return category;
    }
}
